"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */

const serviceTypes = [
  "Analyse physico-chimique des sols",
  "Cartographie pédologique",
  "Études agro-écologiques",
  "Diagnostic de fertilité",
  "Expertise technique pour projets",
  "Assistance aux collectivités",
  "Rapport technique",
  "Appui aux politiques publiques",
  "Autre",
] as const;

const schema = z.object({
  fullName: z.string().min(2, "Le nom est requis"),
  institution: z.string().min(2, "L'institution est requise"),
  email: z.string().email("Adresse e-mail invalide"),
  phone: z.string().optional(),
  serviceType: z.string().min(1, "Veuillez choisir un type de service"),
  description: z.string().min(10, "Veuillez décrire votre demande (min. 10 caractères)"),
});

type FormData = z.infer<typeof schema>;

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const fieldBase =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--inp-vert)] focus:ring-offset-1";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DemandeService() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: FormData) => {
    // TODO: integrate with Parse ServiceRequests collection
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
  };

  return (
    <section
      className="relative overflow-hidden py-20 px-4 sm:py-24 lg:py-28"
      style={{ backgroundColor: "var(--inp-vert)" }}
      aria-labelledby="demande-svc-title"
    >
      {/* Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,.35) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />

      <div className="container relative mx-auto max-w-4xl">
        <SectionTitle
          id="demande-svc-title"
          align="center"
          light
          label="Contactez-nous"
        >
          Soumettre une demande de service
        </SectionTitle>

        {submitted ? (
          <motion.div
            className="mt-12 flex flex-col items-center gap-4 rounded-2xl bg-white p-10 text-center shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--inp-vert)]/10">
              <CheckCircle className="h-8 w-8 text-[var(--inp-vert)]" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Demande envoyée avec succès
            </h3>
            <p className="max-w-md text-sm text-muted-foreground">
              Notre équipe prendra contact avec vous dans les meilleurs délais
              pour l&apos;étude préliminaire de votre demande.
            </p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-12 rounded-2xl bg-white p-8 shadow-xl sm:p-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Nom */}
              <div>
                <label
                  htmlFor="svc-name"
                  className="mb-1.5 block text-xs font-medium text-foreground"
                >
                  Nom complet *
                </label>
                <input
                  id="svc-name"
                  {...register("fullName")}
                  className={cn(fieldBase, errors.fullName && "ring-2 ring-red-400")}
                  placeholder="Ex : Dr Aminata Ba"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
                )}
              </div>

              {/* Institution */}
              <div>
                <label
                  htmlFor="svc-inst"
                  className="mb-1.5 block text-xs font-medium text-foreground"
                >
                  Institution *
                </label>
                <input
                  id="svc-inst"
                  {...register("institution")}
                  className={cn(fieldBase, errors.institution && "ring-2 ring-red-400")}
                  placeholder="Ex : Ministère de l'Agriculture"
                />
                {errors.institution && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.institution.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="svc-email"
                  className="mb-1.5 block text-xs font-medium text-foreground"
                >
                  Adresse e-mail *
                </label>
                <input
                  id="svc-email"
                  type="email"
                  {...register("email")}
                  className={cn(fieldBase, errors.email && "ring-2 ring-red-400")}
                  placeholder="email@institution.sn"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Téléphone */}
              <div>
                <label
                  htmlFor="svc-phone"
                  className="mb-1.5 block text-xs font-medium text-foreground"
                >
                  Téléphone
                </label>
                <input
                  id="svc-phone"
                  type="tel"
                  {...register("phone")}
                  className={fieldBase}
                  placeholder="+221 77 000 00 00"
                />
              </div>

              {/* Type de service */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="svc-type"
                  className="mb-1.5 block text-xs font-medium text-foreground"
                >
                  Type de service demandé *
                </label>
                <select
                  id="svc-type"
                  {...register("serviceType")}
                  className={cn(
                    fieldBase,
                    "appearance-none",
                    errors.serviceType && "ring-2 ring-red-400"
                  )}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Sélectionnez un type de service
                  </option>
                  {serviceTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.serviceType && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.serviceType.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="svc-desc"
                  className="mb-1.5 block text-xs font-medium text-foreground"
                >
                  Description de la demande *
                </label>
                <textarea
                  id="svc-desc"
                  rows={5}
                  {...register("description")}
                  className={cn(
                    fieldBase,
                    "resize-none",
                    errors.description && "ring-2 ring-red-400"
                  )}
                  placeholder="Décrivez le contexte, la zone concernée, les objectifs de l'intervention…"
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="mt-7 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--inp-vert)] px-7 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inp-vert)] focus-visible:ring-offset-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isSubmitting ? "Envoi en cours…" : "Envoyer la demande"}
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
}
