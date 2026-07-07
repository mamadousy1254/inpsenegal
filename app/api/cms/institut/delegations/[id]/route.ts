import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/mongo/db";
import InstitutDelegationModel from "@/lib/mongo/models/institut-delegation.model";
import { CMS_STATUSES } from "@/lib/constants/cms";
import { resolvePublishedAt } from "@/lib/services/cms/serialize-actualite";
import { serializeInstitutDelegation } from "@/lib/services/institut/serialize-institut-delegation";
import { requireCmsAdmin } from "@/lib/services/cms/require-cms-admin";
import { logCmsActivity } from "@/lib/services/cms/log-cms-activity";
import { slugify, uniqueSlug } from "@/lib/utils/slug";

const updateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  shortName: z.string().trim().min(1).optional(),
  organigrammeLabel: z.string().trim().nullable().optional(),
  color: z.string().trim().min(1).optional(),
  chefLieu: z.string().trim().min(1).optional(),
  regionsCouvertes: z.array(z.string().trim()).optional(),
  superficie: z.string().trim().min(1).optional(),
  population: z.string().trim().min(1).optional(),
  typesDeSols: z.array(z.string().trim()).optional(),
  cultureDominantes: z.array(z.string().trim()).optional(),
  enjeuxPedologiques: z.array(z.string().trim()).optional(),
  missionsSpecifiques: z.array(z.string().trim()).optional(),
  delegueNom: z.string().trim().min(1).optional(),
  delegueFonction: z.string().trim().min(1).optional(),
  contactAdresse: z.string().trim().min(1).optional(),
  contactTelephone: z.string().trim().min(1).optional(),
  contactEmail: z.string().trim().email().optional(),
  description: z.string().trim().min(1).optional(),
  sortOrder: z.coerce.number().int().optional(),
  status: z.enum(CMS_STATUSES).optional(),
  publishedAt: z.string().nullable().optional(),
  slug: z.string().trim().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  const authResult = await requireCmsAdmin();
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  await connectDB();
  const item = await InstitutDelegationModel.findById(id).lean();
  if (!item) {
    return NextResponse.json({ error: "Délégation introuvable" }, { status: 404 });
  }

  return NextResponse.json(serializeInstitutDelegation(item));
}

export async function PATCH(req: Request, context: RouteContext) {
  const authResult = await requireCmsAdmin();
  if (authResult.error || !authResult.session) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 },
    );
  }

  await connectDB();
  const item = await InstitutDelegationModel.findById(id);
  if (!item) {
    return NextResponse.json({ error: "Délégation introuvable" }, { status: 404 });
  }

  const data = parsed.data;

  if (data.name !== undefined) item.name = data.name;
  if (data.shortName !== undefined) item.shortName = data.shortName;
  if (data.organigrammeLabel !== undefined) {
    item.organigrammeLabel = data.organigrammeLabel ?? undefined;
  }
  if (data.color !== undefined) item.color = data.color;
  if (data.chefLieu !== undefined) item.chefLieu = data.chefLieu;
  if (data.regionsCouvertes !== undefined) item.regionsCouvertes = data.regionsCouvertes;
  if (data.superficie !== undefined) item.superficie = data.superficie;
  if (data.population !== undefined) item.population = data.population;
  if (data.typesDeSols !== undefined) item.typesDeSols = data.typesDeSols;
  if (data.cultureDominantes !== undefined) item.cultureDominantes = data.cultureDominantes;
  if (data.enjeuxPedologiques !== undefined) item.enjeuxPedologiques = data.enjeuxPedologiques;
  if (data.missionsSpecifiques !== undefined) item.missionsSpecifiques = data.missionsSpecifiques;
  if (data.delegueNom !== undefined) item.delegueNom = data.delegueNom;
  if (data.delegueFonction !== undefined) item.delegueFonction = data.delegueFonction;
  if (data.contactAdresse !== undefined) item.contactAdresse = data.contactAdresse;
  if (data.contactTelephone !== undefined) item.contactTelephone = data.contactTelephone;
  if (data.contactEmail !== undefined) item.contactEmail = data.contactEmail;
  if (data.description !== undefined) item.description = data.description;
  if (data.sortOrder !== undefined) item.sortOrder = data.sortOrder;

  if (data.slug !== undefined) {
    const nextSlug = slugify(data.slug);
    const taken = await InstitutDelegationModel.findOne({
      slug: nextSlug,
      _id: { $ne: item._id },
    }).select("_id");
    if (taken) {
      return NextResponse.json({ error: "Ce slug est déjà utilisé" }, { status: 400 });
    }
    item.slug = nextSlug;
  } else if (data.shortName !== undefined) {
    item.slug = await uniqueSlug(data.shortName, async (candidate) => {
      const existing = await InstitutDelegationModel.findOne({
        slug: candidate,
        _id: { $ne: item._id },
      }).select("_id");
      return !!existing;
    });
  }

  if (data.status !== undefined) {
    item.status = data.status;
    item.publishedAt = resolvePublishedAt({
      status: data.status,
      publishedAt: data.publishedAt ?? item.publishedAt,
    });
  } else if (data.publishedAt !== undefined && item.status === "publie") {
    item.publishedAt = data.publishedAt
      ? resolvePublishedAt({ status: "publie", publishedAt: data.publishedAt })
      : undefined;
  }

  item.updatedBy = new mongoose.Types.ObjectId(authResult.session!.user.id);
  await item.save();

  await logCmsActivity({
    actor: authResult.session.user,
    actionType: "update",
    resource: "InstitutDelegation",
    resourceLabel: "Délégation (institut)",
    resourceId: item._id.toString(),
    title: item.name,
    metadata: { status: item.status },
  });

  return NextResponse.json(serializeInstitutDelegation(item));
}

export async function DELETE(_req: Request, context: RouteContext) {
  const authResult = await requireCmsAdmin();
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status! });
  }

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Identifiant invalide" }, { status: 400 });
  }

  await connectDB();
  const item = await InstitutDelegationModel.findById(id);
  if (!item) {
    return NextResponse.json({ error: "Délégation introuvable" }, { status: 404 });
  }

  const deletedTitle = item.name;
  const deletedId = item._id.toString();
  await item.deleteOne();

  if (authResult.session) {
    await logCmsActivity({
      actor: authResult.session.user,
      actionType: "delete",
      resource: "InstitutDelegation",
      resourceLabel: "Délégation (institut)",
      resourceId: deletedId,
      title: deletedTitle,
    });
  }

  return NextResponse.json({ success: true });
}
