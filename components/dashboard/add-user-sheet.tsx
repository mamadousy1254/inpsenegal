"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AtSignIcon,
  AwardIcon,
  BriefcaseIcon,
  Building2Icon,
  CalendarIcon,
  CalendarOffIcon,
  CalendarPlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CreditCardIcon,
  EyeIcon,
  EyeOffIcon,
  FlagIcon,
  HashIcon,
  HeartIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
  MapPinIcon,
  PhoneCallIcon,
  PhoneIcon,
  ShieldIcon,
  StickyNoteIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  SendCredentialsDialog,
  type CreatedUserCredentials,
} from "@/components/dashboard/send-credentials-dialog";
import { cn } from "@/lib/utils";
import {
  isValidSenegalPhone,
  normalizeSenegalPhone,
} from "@/lib/constants/phone";
import {
  canBeAbsenceValidator,
  NOTIFIER_CHANNELS,
  type NotifierChannel,
} from "@/lib/constants/notifications";
import { NotificationChannelPicker } from "@/components/dashboard/notification-channel-picker";
import { SENEGAL_REGIONS } from "@/lib/constants/senegal-regions";
import { canManageUsers } from "@/lib/permissions/can";
import {
  CONTRACT_TYPES,
  GENDERS,
  MARITAL_STATUSES,
  USER_ROLE_LABELS,
  USER_ROLES,
  type UserRole,
} from "@/lib/permissions/roles";

const optionalString = z.string().trim().optional().or(z.literal(""));

const optionalSenegalPhone = optionalString.refine(
  (value) => !value || isValidSenegalPhone(value),
  {
    message:
      "Le numéro doit commencer par +221 suivi de 9 chiffres (ex. +221778417586)",
  },
);

const addUserFormSchema = z.object({
  firstname: z.string().trim().min(1, "Le prénom est requis"),
  lastname: z.string().trim().min(1, "Le nom est requis"),
  email: z.string().email("Adresse e-mail invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  phone: optionalSenegalPhone,
  occupation: z.string().trim().min(1, "La fonction est requise"),
  service: optionalString,
  section: z.enum(SENEGAL_REGIONS),
  role: z.enum(USER_ROLES),
  // Champs facultatifs
  username: optionalString,
  phoneSecondary: optionalSenegalPhone,
  address: optionalString,
  city: optionalString,
  gender: z.enum(GENDERS).optional().or(z.literal("")),
  maritalStatus: z.enum(MARITAL_STATUSES).optional().or(z.literal("")),
  dateOfBirth: optionalString,
  nationality: optionalString,
  nationalId: optionalString,
  numberOfChildren: optionalString,
  matricule: optionalString,
  direction: optionalString,
  grade: optionalString,
  contractType: z.enum(CONTRACT_TYPES).optional().or(z.literal("")),
  contractYear: optionalString,
  hireDate: optionalString,
  endDate: optionalString,
  notes: optionalString,
  validatorNotifyChannel: z.enum(NOTIFIER_CHANNELS).optional().or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.contractType) {
    if (!data.hireDate?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["hireDate"],
        message: "La date d'embauche est requise",
      });
    }
    if (!data.contractYear?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["contractYear"],
        message: "L'année du contrat est requise",
      });
    }
  }
});

type AddUserFormValues = z.infer<typeof addUserFormSchema>;

const defaultValues: AddUserFormValues = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  phone: "",
  occupation: "",
  service: "",
  section: "Dakar",
  role: "employe",
  username: "",
  phoneSecondary: "",
  address: "",
  city: "",
  gender: "",
  maritalStatus: "",
  dateOfBirth: "",
  nationality: "Sénégalaise",
  nationalId: "",
  numberOfChildren: "",
  matricule: "",
  direction: "",
  grade: "",
  contractType: "",
  contractYear: String(new Date().getFullYear()),
  hireDate: "",
  endDate: "",
  notes: "",
  validatorNotifyChannel: "sms",
};

const GENDER_LABELS: Record<(typeof GENDERS)[number], string> = {
  homme: "Homme",
  femme: "Femme",
};

const MARITAL_LABELS: Record<(typeof MARITAL_STATUSES)[number], string> = {
  celibataire: "Célibataire",
  marie: "Marié(e)",
  divorce: "Divorcé(e)",
  veuf: "Veuf(ve)",
};

const CONTRACT_LABELS: Record<(typeof CONTRACT_TYPES)[number], string> = {
  cdi: "CDI",
  cdd: "CDD",
  stage: "Stage",
  consultant: "Consultant",
  autre: "Autre",
};

function cleanPayload(values: AddUserFormValues) {
  const payload: Record<string, unknown> = {
    email: values.email.trim().toLowerCase(),
    password: values.password,
    firstname: values.firstname.trim(),
    lastname: values.lastname.trim(),
    section: values.section,
    role: values.role,
    occupation: values.occupation.trim(),
    isActive: true,
    mustChangePassword: false,
  };

  const optionalFields: (keyof AddUserFormValues)[] = [
    "phone",
    "service",
    "username",
    "phoneSecondary",
    "address",
    "city",
    "nationality",
    "nationalId",
    "matricule",
    "direction",
    "grade",
    "notes",
    "dateOfBirth",
    "hireDate",
    "endDate",
  ];

  for (const key of optionalFields) {
    const value = values[key]?.trim();
    if (!value) continue;

    if (key === "phone" || key === "phoneSecondary") {
      payload[key] = normalizeSenegalPhone(value);
    } else {
      payload[key] = value;
    }
  }

  if (values.gender) payload.gender = values.gender;
  if (values.maritalStatus) payload.maritalStatus = values.maritalStatus;
  if (values.contractType) payload.contractType = values.contractType;
  const contractYear = values.contractYear?.trim();
  if (contractYear && !Number.isNaN(Number(contractYear))) {
    payload.contractYear = Number(contractYear);
  }

  const children = values.numberOfChildren?.trim();
  if (children && !Number.isNaN(Number(children))) {
    payload.numberOfChildren = Number(children);
  }

  if (canBeAbsenceValidator(values.role)) {
    payload.validatorNotifyChannel =
      values.validatorNotifyChannel === "email" ? "email" : "sms";
  }

  return payload;
}

function FieldLabel({
  htmlFor,
  children,
  optional = false,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <Label htmlFor={htmlFor} className="flex items-center gap-1.5">
      {children}
      {optional && (
        <span className="text-[10px] font-normal text-muted-foreground">
          (facultatif)
        </span>
      )}
    </Label>
  );
}

function IconInput({
  icon: Icon,
  iconClassName,
  className,
  ...props
}: React.ComponentProps<typeof Input> & {
  icon: LucideIcon;
  iconClassName?: string;
}) {
  return (
    <div className="relative">
      <Icon
        className={cn(
          "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2",
          iconClassName ?? "text-muted-foreground",
        )}
      />
      <Input className={cn("pl-9", className)} {...props} />
    </div>
  );
}

function IconPasswordInput({
  icon: Icon,
  iconClassName,
  className,
  ...props
}: React.ComponentProps<typeof Input> & {
  icon: LucideIcon;
  iconClassName?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Icon
        className={cn(
          "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2",
          iconClassName ?? "text-muted-foreground",
        )}
      />
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pl-9 pr-9", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="absolute top-1/2 right-1.5 -translate-y-1/2"
        onClick={() => setShowPassword((value) => !value)}
        tabIndex={-1}
        aria-label={
          showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
        }
      >
        {showPassword ? (
          <EyeOffIcon className="size-3.5" />
        ) : (
          <EyeIcon className="size-3.5" />
        )}
      </Button>
    </div>
  );
}

function IconSelect({
  icon: Icon,
  iconClassName,
  children,
}: {
  icon: LucideIcon;
  iconClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Icon
        className={cn(
          "pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2",
          iconClassName ?? "text-muted-foreground",
        )}
      />
      {children}
    </div>
  );
}

function SelectTriggerWithIcon({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectTrigger>) {
  return (
    <SelectTrigger className={cn("pl-9", className)} {...props}>
      {children}
    </SelectTrigger>
  );
}

export function AddUserSheet() {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [createdCredentials, setCreatedCredentials] =
    useState<CreatedUserCredentials | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserFormSchema),
    defaultValues,
  });

  const role = watch("role");
  const section = watch("section");
  const gender = watch("gender");
  const maritalStatus = watch("maritalStatus");
  const contractType = watch("contractType");

  const canAdd = session?.user?.role
    ? canManageUsers(session.user.role as UserRole)
    : false;

  if (!canAdd) return null;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      reset(defaultValues);
      setShowExtraFields(false);
    }
  };

  const onSubmit = async (values: AddUserFormValues) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanPayload(values)),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error ?? "Impossible de créer l'utilisateur");
        return;
      }

      toast.success("Utilisateur créé avec succès", {
        description: `${values.firstname} ${values.lastname}`,
      });

      const normalizedPhone = values.phone?.trim()
        ? normalizeSenegalPhone(values.phone.trim())
        : undefined;

      setCreatedCredentials({
        firstname: values.firstname.trim(),
        lastname: values.lastname.trim(),
        email: values.email.trim().toLowerCase(),
        phone: normalizedPhone,
        password: values.password,
      });

      reset(defaultValues);
      setShowExtraFields(false);
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue lors de la création");
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        render={
          <Button
            size="sm"
            className="gap-1.5 bg-[var(--inp-vert)] text-white hover:bg-[var(--inp-vert)]/90"
          />
        }
      >
        <UserPlusIcon className="size-4" />
        <span className="hidden sm:inline">Nouvel utilisateur</span>
        <span className="sm:hidden">Ajouter</span>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle>Nouvel utilisateur</SheetTitle>
          <SheetDescription>
            Renseignez les champs obligatoires. Les autres informations peuvent
            être ajoutées maintenant ou plus tard.
          </SheetDescription>
        </SheetHeader>

        <form
          id="add-user-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-4 px-4 pb-4"
        >
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Informations obligatoires
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <FieldLabel htmlFor="firstname">Prénom</FieldLabel>
              <IconInput
                id="firstname"
                icon={UserIcon}
                iconClassName="text-[var(--inp-vert)]"
                placeholder="Ex. Aminata"
                {...register("firstname")}
              />
              {errors.firstname && (
                <p className="text-xs text-destructive">
                  {errors.firstname.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="lastname">Nom</FieldLabel>
              <IconInput
                id="lastname"
                icon={UserIcon}
                iconClassName="text-[var(--inp-vert)]"
                placeholder="Ex. Ba"
                {...register("lastname")}
              />
              {errors.lastname && (
                <p className="text-xs text-destructive">
                  {errors.lastname.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <IconInput
              id="email"
              type="email"
              icon={MailIcon}
              iconClassName="text-sky-600"
              placeholder="prenom.nom@inp.gouv.sn"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
            <IconPasswordInput
              id="password"
              icon={LockIcon}
              iconClassName="text-amber-600"
              placeholder="Minimum 8 caractères"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <FieldLabel htmlFor="occupation">Fonction</FieldLabel>
            <IconInput
              id="occupation"
              icon={BriefcaseIcon}
              iconClassName="text-violet-600"
              placeholder="Ex. Chercheur en pédologie"
              {...register("occupation")}
            />
            {errors.occupation && (
              <p className="text-xs text-destructive">
                {errors.occupation.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <FieldLabel>Section (région)</FieldLabel>
              <IconSelect icon={MapPinIcon} iconClassName="text-orange-600">
                <Select
                  value={section}
                  onValueChange={(v) =>
                    setValue("section", v as AddUserFormValues["section"], {
                      shouldValidate: true,
                    })
                  }
                  items={SENEGAL_REGIONS.map((r) => ({ label: r, value: r }))}
                >
                  <SelectTriggerWithIcon>
                    <SelectValue placeholder="Choisir une région" />
                  </SelectTriggerWithIcon>
                  <SelectContent>
                    <SelectGroup>
                      {SENEGAL_REGIONS.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </IconSelect>
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Rôle</FieldLabel>
              <IconSelect icon={ShieldIcon} iconClassName="text-indigo-600">
                <Select
                  value={role}
                  onValueChange={(v) =>
                    setValue("role", v as UserRole, { shouldValidate: true })
                  }
                  items={USER_ROLES.map((r) => ({
                    label: USER_ROLE_LABELS[r],
                    value: r,
                  }))}
                >
                  <SelectTriggerWithIcon>
                    <SelectValue placeholder="Choisir un rôle" />
                  </SelectTriggerWithIcon>
                  <SelectContent>
                    <SelectGroup>
                      {USER_ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {USER_ROLE_LABELS[r]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </IconSelect>
            </div>
          </div>

          {canBeAbsenceValidator(role) && (
            <NotificationChannelPicker
              id="add-user-validator-notify"
              value={
                (watch("validatorNotifyChannel") as NotifierChannel | "") ||
                "sms"
              }
              onChange={(channel) =>
                setValue("validatorNotifyChannel", channel, {
                  shouldValidate: true,
                })
              }
              label="Notifications validateur (absences)"
              description="Canal utilisé lorsque cette personne doit valider une demande d'absence."
            />
          )}

          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Contact & service
          </p>

          <div className="space-y-1.5">
            <FieldLabel htmlFor="phone" optional>
              Téléphone
            </FieldLabel>
            <IconInput
              id="phone"
              icon={PhoneIcon}
              iconClassName="text-emerald-600"
              placeholder="+221778417586"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <FieldLabel htmlFor="service" optional>
              Service
            </FieldLabel>
            <IconInput
              id="service"
              icon={Building2Icon}
              iconClassName="text-blue-600"
              placeholder="Ex. Laboratoire des sols"
              {...register("service")}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-1 w-full justify-between gap-2"
            onClick={() => setShowExtraFields((v) => !v)}
          >
            <span>
              {showExtraFields
                ? "Masquer les champs supplémentaires"
                : "Ajouter d'autres champs (facultatif)"}
            </span>
            {showExtraFields ? (
              <ChevronUpIcon className="size-4 shrink-0" />
            ) : (
              <ChevronDownIcon className="size-4 shrink-0" />
            )}
          </Button>

          {showExtraFields && (
            <div className="flex flex-col gap-4 rounded-lg border border-dashed border-[var(--inp-vert)]/25 bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground">
                Tous les champs ci-dessous sont optionnels. Laissez vide ce
                que vous ne souhaitez pas renseigner.
              </p>

              <div className="space-y-1.5">
                <FieldLabel htmlFor="username" optional>
                  Nom d&apos;utilisateur
                </FieldLabel>
                <IconInput
                  id="username"
                  icon={AtSignIcon}
                  iconClassName="text-slate-600"
                  placeholder="Ex. aba"
                  {...register("username")}
                />
              </div>

              <div className="space-y-1.5">
                <FieldLabel htmlFor="matricule" optional>
                  Matricule
                </FieldLabel>
                <IconInput
                  id="matricule"
                  icon={HashIcon}
                  iconClassName="text-purple-600"
                  placeholder="Ex. INP-2026-0142"
                  {...register("matricule")}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="phoneSecondary" optional>
                    Tél. secondaire
                  </FieldLabel>
                  <IconInput
                    id="phoneSecondary"
                    icon={PhoneCallIcon}
                    iconClassName="text-teal-600"
                    placeholder="+221778417586"
                    {...register("phoneSecondary")}
                  />
                  {errors.phoneSecondary && (
                    <p className="text-xs text-destructive">
                      {errors.phoneSecondary.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="nationalId" optional>
                    CNI / Passeport
                  </FieldLabel>
                  <IconInput
                    id="nationalId"
                    icon={CreditCardIcon}
                    iconClassName="text-rose-600"
                    placeholder="Numéro d'identification"
                    {...register("nationalId")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel optional>Genre</FieldLabel>
                  <IconSelect icon={UsersIcon} iconClassName="text-pink-600">
                    <Select
                      value={gender || ""}
                      onValueChange={(v) =>
                        setValue("gender", v as AddUserFormValues["gender"])
                      }
                      items={[
                        { label: "Non renseigné", value: "" },
                        ...GENDERS.map((g) => ({
                          label: GENDER_LABELS[g],
                          value: g,
                        })),
                      ]}
                    >
                      <SelectTriggerWithIcon>
                        <SelectValue placeholder="Choisir le genre" />
                      </SelectTriggerWithIcon>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="">Non renseigné</SelectItem>
                          {GENDERS.map((g) => (
                            <SelectItem key={g} value={g}>
                              {GENDER_LABELS[g]}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </IconSelect>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel optional>Situation matrimoniale</FieldLabel>
                  <IconSelect icon={HeartIcon} iconClassName="text-rose-500">
                    <Select
                      value={maritalStatus || ""}
                      onValueChange={(v) =>
                        setValue(
                          "maritalStatus",
                          v as AddUserFormValues["maritalStatus"],
                        )
                      }
                      items={[
                        { label: "Non renseigné", value: "" },
                        ...MARITAL_STATUSES.map((s) => ({
                          label: MARITAL_LABELS[s],
                          value: s,
                        })),
                      ]}
                    >
                      <SelectTriggerWithIcon>
                        <SelectValue placeholder="Choisir la situation" />
                      </SelectTriggerWithIcon>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="">Non renseigné</SelectItem>
                          {MARITAL_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {MARITAL_LABELS[s]}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </IconSelect>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="dateOfBirth" optional>
                    Date de naissance
                  </FieldLabel>
                  <IconInput
                    id="dateOfBirth"
                    type="date"
                    icon={CalendarIcon}
                    iconClassName="text-cyan-600"
                    {...register("dateOfBirth")}
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="numberOfChildren" optional>
                    Nombre d&apos;enfants
                  </FieldLabel>
                  <IconInput
                    id="numberOfChildren"
                    type="number"
                    min={0}
                    icon={UsersIcon}
                    iconClassName="text-amber-600"
                    placeholder="0"
                    {...register("numberOfChildren")}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <FieldLabel htmlFor="nationality" optional>
                  Nationalité
                </FieldLabel>
                <IconInput
                  id="nationality"
                  icon={FlagIcon}
                  iconClassName="text-green-600"
                  placeholder="Ex. Sénégalaise"
                  {...register("nationality")}
                />
              </div>

              <div className="space-y-1.5">
                <FieldLabel htmlFor="address" optional>
                  Adresse
                </FieldLabel>
                <IconInput
                  id="address"
                  icon={MapPinIcon}
                  iconClassName="text-orange-600"
                  placeholder="Ex. Avenue Cheikh Anta Diop"
                  {...register("address")}
                />
              </div>

              <div className="space-y-1.5">
                <FieldLabel htmlFor="city" optional>
                  Ville
                </FieldLabel>
                <IconInput
                  id="city"
                  icon={Building2Icon}
                  iconClassName="text-slate-600"
                  placeholder="Ex. Dakar"
                  {...register("city")}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="direction" optional>
                    Direction
                  </FieldLabel>
                  <IconInput
                    id="direction"
                    icon={Building2Icon}
                    iconClassName="text-indigo-600"
                    placeholder="Ex. Direction de la recherche"
                    {...register("direction")}
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="grade" optional>
                    Grade
                  </FieldLabel>
                  <IconInput
                    id="grade"
                    icon={AwardIcon}
                    iconClassName="text-yellow-600"
                    placeholder="Ex. Ingénieur de recherche"
                    {...register("grade")}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <FieldLabel optional>Type de contrat</FieldLabel>
                <IconSelect icon={BriefcaseIcon} iconClassName="text-violet-600">
                  <Select
                    value={contractType || ""}
                    onValueChange={(v) =>
                      setValue(
                        "contractType",
                        v as AddUserFormValues["contractType"],
                      )
                    }
                  >
                    <SelectTriggerWithIcon>
                      <SelectValue placeholder="Choisir le type de contrat" />
                    </SelectTriggerWithIcon>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="">Non renseigné</SelectItem>
                        {CONTRACT_TYPES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {CONTRACT_LABELS[c]}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </IconSelect>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="contractYear">
                    Année du contrat
                  </FieldLabel>
                  <IconInput
                    id="contractYear"
                    type="number"
                    min={2000}
                    max={2100}
                    icon={CalendarIcon}
                    iconClassName="text-violet-600"
                    placeholder="Ex. 2025"
                    {...register("contractYear")}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    CDI : année de début · CDD : année civile du contrat
                  </p>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="hireDate">
                    Date d&apos;embauche
                  </FieldLabel>
                  <IconInput
                    id="hireDate"
                    type="date"
                    icon={CalendarPlusIcon}
                    iconClassName="text-emerald-600"
                    {...register("hireDate")}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <FieldLabel htmlFor="endDate" optional>
                  Fin de contrat (CDD — laisser vide = 31 déc. de l&apos;année)
                </FieldLabel>
                <IconInput
                  id="endDate"
                  type="date"
                  icon={CalendarOffIcon}
                  iconClassName="text-rose-600"
                  {...register("endDate")}
                />
              </div>

              <div className="space-y-1.5">
                <FieldLabel htmlFor="notes" optional>
                  Notes internes RH
                </FieldLabel>
                <IconInput
                  id="notes"
                  icon={StickyNoteIcon}
                  iconClassName="text-amber-700"
                  placeholder="Remarque visible uniquement par les RH"
                  {...register("notes")}
                />
              </div>
            </div>
          )}
        </form>

        <SheetFooter className="flex-row gap-2 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => handleOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            form="add-user-form"
            disabled={isSubmitting}
            className={cn(
              "flex-1 bg-[var(--inp-vert)] text-white hover:bg-[var(--inp-vert)]/90",
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Création…
              </>
            ) : (
              "Créer l'utilisateur"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>

      <SendCredentialsDialog
        credentials={createdCredentials}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setCreatedCredentials(null);
        }}
      />
    </>
  );
}
