"use client";

import { useState } from "react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
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
  LockIcon,
  MailIcon,
  MapPinIcon,
  PhoneCallIcon,
  PhoneIcon,
  ShieldIcon,
  StickyNoteIcon,
  UserIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NotificationChannelPicker } from "@/components/dashboard/notification-channel-picker";
import {
  canBeAbsenceValidator,
  type NotifierChannel,
} from "@/lib/constants/notifications";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CONTRACT_LABELS,
  GENDER_LABELS,
  MARITAL_LABELS,
} from "@/lib/constants/user-labels";
import { SENEGAL_REGIONS } from "@/lib/constants/senegal-regions";
import type {
  CreateUserFormValues,
  EditUserFormValues,
} from "@/lib/forms/user-form";
import {
  CONTRACT_TYPES,
  GENDERS,
  MARITAL_STATUSES,
  USER_ROLE_LABELS,
  USER_ROLES,
  type UserRole,
} from "@/lib/permissions/roles";
import { cn } from "@/lib/utils";

type SharedUserFormValues = CreateUserFormValues | EditUserFormValues;

type BaseUserFormFieldsProps = {
  showExtraFields: boolean;
  setShowExtraFields: React.Dispatch<React.SetStateAction<boolean>>;
};

type CreateUserFormFieldsProps = BaseUserFormFieldsProps & {
  mode: "create";
  register: UseFormRegister<CreateUserFormValues>;
  errors: FieldErrors<CreateUserFormValues>;
  watch: UseFormWatch<CreateUserFormValues>;
  setValue: UseFormSetValue<CreateUserFormValues>;
};

type EditUserFormFieldsProps = BaseUserFormFieldsProps & {
  mode: "edit";
  register: UseFormRegister<EditUserFormValues>;
  errors: FieldErrors<EditUserFormValues>;
  watch: UseFormWatch<EditUserFormValues>;
  setValue: UseFormSetValue<EditUserFormValues>;
  changePassword: boolean;
  setChangePassword: (value: boolean) => void;
};

export type UserFormFieldsProps =
  | CreateUserFormFieldsProps
  | EditUserFormFieldsProps;

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

function AccountCheckbox({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      <Label htmlFor={id} className="cursor-pointer font-normal">
        {label}
      </Label>
    </div>
  );
}

function ContractFieldsSection({
  fieldId,
  contractType,
  hireDate,
  endDate,
  errors,
  register,
  setValue,
}: {
  fieldId: (name: string) => string;
  contractType: string;
  hireDate: string;
  endDate: string;
  errors: FieldErrors<EditUserFormValues>;
  register: UseFormRegister<EditUserFormValues>;
  setValue: UseFormSetValue<EditUserFormValues>;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-muted/20 p-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Contrat
      </p>

      <div className="space-y-1.5">
        <FieldLabel optional>Type de contrat</FieldLabel>
        <IconSelect icon={BriefcaseIcon} iconClassName="text-violet-600">
          <Select
            value={contractType || ""}
            onValueChange={(v) =>
              setValue(
                "contractType",
                v as EditUserFormValues["contractType"],
                { shouldValidate: true },
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
          <FieldLabel htmlFor={fieldId("contractYear")}>
            Année du contrat
          </FieldLabel>
          <IconInput
            id={fieldId("contractYear")}
            type="number"
            min={2000}
            max={2100}
            icon={CalendarIcon}
            iconClassName="text-violet-600"
            placeholder="Ex. 2025"
            {...register("contractYear")}
          />
        </div>
        <div className="space-y-1.5">
          <FieldLabel htmlFor={fieldId("hireDate")}>
            Date d&apos;embauche
          </FieldLabel>
          <IconInput
            id={fieldId("hireDate")}
            type="date"
            icon={CalendarPlusIcon}
            iconClassName="text-emerald-600"
            value={hireDate}
            onChange={(event) =>
              setValue("hireDate", event.target.value, { shouldValidate: true })
            }
          />
          {errors.hireDate && (
            <p className="text-xs text-destructive">{errors.hireDate.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <FieldLabel htmlFor={fieldId("endDate")} optional>
          Fin de contrat
        </FieldLabel>
        <IconInput
          id={fieldId("endDate")}
          type="date"
          icon={CalendarOffIcon}
          iconClassName="text-rose-600"
          value={endDate}
          onChange={(event) =>
            setValue("endDate", event.target.value, { shouldValidate: true })
          }
        />
      </div>
    </div>
  );
}

export function UserFormFields(props: UserFormFieldsProps) {
  const { mode, showExtraFields, setShowExtraFields } = props;

  const register = props.register as UseFormRegister<EditUserFormValues>;
  const errors = props.errors as FieldErrors<EditUserFormValues>;
  const watch = props.watch as UseFormWatch<EditUserFormValues>;
  const setValue = props.setValue as UseFormSetValue<EditUserFormValues>;

  const formId = mode === "create" ? "create-user" : "edit-user";
  const fieldId = (name: string) => `${formId}-${name}`;

  const role = watch("role");
  const section = watch("section");
  const gender = watch("gender");
  const maritalStatus = watch("maritalStatus");
  const contractType = watch("contractType");
  const hireDate = watch("hireDate") ?? "";
  const endDate = watch("endDate") ?? "";
  const validatorNotifyChannel =
    (watch("validatorNotifyChannel") as NotifierChannel | "") || "sms";

  const isActive = mode === "edit" ? watch("isActive") : undefined;
  const showValidatorNotifyPreference = canBeAbsenceValidator(role);

  const showContractSection =
    mode === "edit" &&
    Boolean(contractType || hireDate || endDate);

  const changePassword = mode === "edit" ? props.changePassword : false;
  const setChangePassword =
    mode === "edit" ? props.setChangePassword : undefined;

  return (
    <>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Informations obligatoires
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <FieldLabel htmlFor={fieldId("firstname")}>Prénom</FieldLabel>
          <IconInput
            id={fieldId("firstname")}
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
          <FieldLabel htmlFor={fieldId("lastname")}>Nom</FieldLabel>
          <IconInput
            id={fieldId("lastname")}
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
        <FieldLabel htmlFor={fieldId("email")}>E-mail</FieldLabel>
        <IconInput
          id={fieldId("email")}
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

      {mode === "create" ? (
        <div className="space-y-1.5">
          <FieldLabel htmlFor={fieldId("password")}>Mot de passe</FieldLabel>
          <IconPasswordInput
            id={fieldId("password")}
            icon={LockIcon}
            iconClassName="text-amber-600"
            placeholder="Minimum 8 caractères"
            {...register("password")}
          />
          {"password" in errors && errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Mot de passe
          </p>
          <AccountCheckbox
            id={fieldId("change-password")}
            label="Modifier le mot de passe"
            checked={changePassword}
            onCheckedChange={(checked) => setChangePassword?.(checked)}
          />
          {changePassword && (
            <>
              <div className="space-y-1.5">
                <FieldLabel htmlFor={fieldId("password")}>
                  Nouveau mot de passe
                </FieldLabel>
                <IconPasswordInput
                  id={fieldId("password")}
                  icon={LockIcon}
                  iconClassName="text-amber-600"
                  placeholder="Minimum 8 caractères"
                  {...register("password")}
                />
                {"password" in errors && errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor={fieldId("confirmPassword")}>
                  Confirmer le mot de passe
                </FieldLabel>
                <IconPasswordInput
                  id={fieldId("confirmPassword")}
                  icon={LockIcon}
                  iconClassName="text-amber-600"
                  placeholder="Répéter le mot de passe"
                  {...register("confirmPassword")}
                />
                {"confirmPassword" in errors && errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <FieldLabel htmlFor={fieldId("occupation")}>Fonction</FieldLabel>
        <IconInput
          id={fieldId("occupation")}
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
                setValue("section", v as EditUserFormValues["section"], {
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

      {showValidatorNotifyPreference && (
        <NotificationChannelPicker
          id={fieldId("validator-notify")}
          value={validatorNotifyChannel === "email" ? "email" : "sms"}
          onChange={(channel) =>
            setValue("validatorNotifyChannel", channel, { shouldValidate: true })
          }
          label="Notifications validateur (absences)"
          description="Canal utilisé lorsque cette personne doit valider une demande d'absence."
        />
      )}

      {mode === "edit" && (
        <>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Compte
          </p>
          <div className="flex flex-col gap-3">
            <AccountCheckbox
              id={fieldId("isActive")}
              label="Compte actif"
              checked={isActive ?? false}
              onCheckedChange={(checked) =>
                setValue("isActive", checked, { shouldValidate: true })
              }
            />
          </div>
        </>
      )}

      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Contact & service
      </p>

      <div className="space-y-1.5">
        <FieldLabel htmlFor={fieldId("phone")} optional>
          Téléphone
        </FieldLabel>
        <IconInput
          id={fieldId("phone")}
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
        <FieldLabel htmlFor={fieldId("service")} optional>
          Service
        </FieldLabel>
        <IconInput
          id={fieldId("service")}
          icon={Building2Icon}
          iconClassName="text-blue-600"
          placeholder="Ex. Laboratoire des sols"
          {...register("service")}
        />
      </div>

      {showContractSection && (
        <ContractFieldsSection
          fieldId={fieldId}
          contractType={contractType ?? ""}
          hireDate={hireDate}
          endDate={endDate}
          errors={errors}
          register={register}
          setValue={setValue}
        />
      )}

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
            Tous les champs ci-dessous sont optionnels. Laissez vide ce que vous
            ne souhaitez pas renseigner.
          </p>

          <div className="space-y-1.5">
            <FieldLabel htmlFor={fieldId("username")} optional>
              Nom d&apos;utilisateur
            </FieldLabel>
            <IconInput
              id={fieldId("username")}
              icon={AtSignIcon}
              iconClassName="text-slate-600"
              placeholder="Ex. aba"
              {...register("username")}
            />
          </div>

          <div className="space-y-1.5">
            <FieldLabel htmlFor={fieldId("matricule")} optional>
              Matricule
            </FieldLabel>
            <IconInput
              id={fieldId("matricule")}
              icon={HashIcon}
              iconClassName="text-purple-600"
              placeholder="Ex. INP-2026-0142"
              {...register("matricule")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <FieldLabel htmlFor={fieldId("phoneSecondary")} optional>
                Tél. secondaire
              </FieldLabel>
              <IconInput
                id={fieldId("phoneSecondary")}
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
              <FieldLabel htmlFor={fieldId("nationalId")} optional>
                CNI / Passeport
              </FieldLabel>
              <IconInput
                id={fieldId("nationalId")}
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
                    setValue("gender", v as EditUserFormValues["gender"])
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
                      v as EditUserFormValues["maritalStatus"],
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
              <FieldLabel htmlFor={fieldId("dateOfBirth")} optional>
                Date de naissance
              </FieldLabel>
              <IconInput
                id={fieldId("dateOfBirth")}
                type="date"
                icon={CalendarIcon}
                iconClassName="text-cyan-600"
                {...register("dateOfBirth")}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor={fieldId("numberOfChildren")} optional>
                Nombre d&apos;enfants
              </FieldLabel>
              <IconInput
                id={fieldId("numberOfChildren")}
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
            <FieldLabel htmlFor={fieldId("nationality")} optional>
              Nationalité
            </FieldLabel>
            <IconInput
              id={fieldId("nationality")}
              icon={FlagIcon}
              iconClassName="text-green-600"
              placeholder="Ex. Sénégalaise"
              {...register("nationality")}
            />
          </div>

          <div className="space-y-1.5">
            <FieldLabel htmlFor={fieldId("address")} optional>
              Adresse
            </FieldLabel>
            <IconInput
              id={fieldId("address")}
              icon={MapPinIcon}
              iconClassName="text-orange-600"
              placeholder="Ex. Avenue Cheikh Anta Diop"
              {...register("address")}
            />
          </div>

          <div className="space-y-1.5">
            <FieldLabel htmlFor={fieldId("city")} optional>
              Ville
            </FieldLabel>
            <IconInput
              id={fieldId("city")}
              icon={Building2Icon}
              iconClassName="text-slate-600"
              placeholder="Ex. Dakar"
              {...register("city")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <FieldLabel htmlFor={fieldId("direction")} optional>
                Direction
              </FieldLabel>
              <IconInput
                id={fieldId("direction")}
                icon={Building2Icon}
                iconClassName="text-indigo-600"
                placeholder="Ex. Direction de la recherche"
                {...register("direction")}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor={fieldId("grade")} optional>
                Grade
              </FieldLabel>
              <IconInput
                id={fieldId("grade")}
                icon={AwardIcon}
                iconClassName="text-yellow-600"
                placeholder="Ex. Ingénieur de recherche"
                {...register("grade")}
              />
            </div>
          </div>

          {mode === "create" && (
            <ContractFieldsSection
              fieldId={fieldId}
              contractType={contractType ?? ""}
              hireDate={hireDate}
              endDate={endDate}
              errors={errors}
              register={register}
              setValue={setValue}
            />
          )}

          <div className="space-y-1.5">
            <FieldLabel htmlFor={fieldId("notes")} optional>
              Notes internes RH
            </FieldLabel>
            <IconInput
              id={fieldId("notes")}
              icon={StickyNoteIcon}
              iconClassName="text-amber-700"
              placeholder="Remarque visible uniquement par les RH"
              {...register("notes")}
            />
          </div>
        </div>
      )}
    </>
  );
}
