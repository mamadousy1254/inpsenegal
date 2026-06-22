import { z } from "zod";

import {
  isValidSenegalPhone,
  normalizeSenegalPhone,
} from "@/lib/constants/phone";
import {
  canBeAbsenceValidator,
  NOTIFIER_CHANNELS,
} from "@/lib/constants/notifications";
import { SENEGAL_REGIONS } from "@/lib/constants/senegal-regions";
import {
  CONTRACT_TYPES,
  GENDERS,
  MARITAL_STATUSES,
  USER_ROLES,
  type UserRole,
} from "@/lib/permissions/roles";
import { resolveUserContractYear } from "@/lib/services/users/prepare-contract-fields";
import type { UserDetail } from "@/lib/types/user-detail";

export const optionalString = z.string().trim().optional().or(z.literal(""));

export const optionalSenegalPhone = optionalString.refine(
  (value) => !value || isValidSenegalPhone(value),
  {
    message:
      "Le numéro doit commencer par +221 suivi de 9 chiffres (ex. +221778417586)",
  },
);

const sharedUserFields = {
  firstname: z.string().trim().min(1, "Le prénom est requis"),
  lastname: z.string().trim().min(1, "Le nom est requis"),
  email: z.string().email("Adresse e-mail invalide"),
  phone: optionalSenegalPhone,
  occupation: z.string().trim().min(1, "La fonction est requise"),
  service: optionalString,
  section: z.enum(SENEGAL_REGIONS),
  role: z.enum(USER_ROLES),
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
};

export const createUserFormSchema = z
  .object({
    ...sharedUserFields,
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  })
  .superRefine((data, ctx) => {
    if (data.contractType) {
      if (!data.hireDate?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["hireDate"],
          message: "La date d'embauche est requise avec un type de contrat",
        });
      }
      if (!data.contractYear?.trim() && !data.hireDate?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["contractYear"],
          message: "L'année du contrat est requise",
        });
      }
    }
  });

export const editUserFormSchema = z
  .object({
    ...sharedUserFields,
    isActive: z.boolean(),
    changePassword: z.boolean(),
    password: optionalString,
    confirmPassword: optionalString,
  })
  .superRefine((data, ctx) => {
    if (data.contractType) {
      if (!data.hireDate?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["hireDate"],
          message: "La date d'embauche est requise avec un type de contrat",
        });
      }
      if (!data.contractYear?.trim() && !data.hireDate?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["contractYear"],
          message: "L'année du contrat est requise",
        });
      }
    }

    if (!data.changePassword) return;

    if (!data.password || data.password.length < 8) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Le mot de passe doit contenir au moins 8 caractères",
      });
    }

    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Les mots de passe ne correspondent pas",
      });
    }
  });

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;
export type EditUserFormValues = z.infer<typeof editUserFormSchema>;
export type UserFormValues = CreateUserFormValues | EditUserFormValues;

export const createUserDefaultValues: CreateUserFormValues = {
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

export const editUserDefaultValues: EditUserFormValues = {
  ...createUserDefaultValues,
  isActive: true,
  changePassword: false,
  password: "",
  confirmPassword: "",
};

function formatDateForInput(value?: string) {
  if (!value) return "";
  return value.slice(0, 10);
}

export function userDetailToEditFormValues(user: UserDetail): EditUserFormValues {
  return {
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone ?? "",
    occupation: user.occupation,
    service: user.service ?? "",
    section: user.section as EditUserFormValues["section"],
    role: user.role,
    username: user.username ?? "",
    phoneSecondary: user.phoneSecondary ?? "",
    address: user.address ?? "",
    city: user.city ?? "",
    gender: user.gender ?? "",
    maritalStatus: user.maritalStatus ?? "",
    dateOfBirth: formatDateForInput(user.dateOfBirth),
    nationality: user.nationality ?? "",
    nationalId: user.nationalId ?? "",
    numberOfChildren:
      user.numberOfChildren !== undefined ? String(user.numberOfChildren) : "",
    matricule: user.matricule ?? "",
    direction: user.direction ?? "",
    grade: user.grade ?? "",
    contractType: user.contractType ?? "",
    contractYear:
      user.contractYear !== undefined
        ? String(user.contractYear)
        : user.hireDate
          ? String(new Date(user.hireDate).getFullYear())
          : String(new Date().getFullYear()),
    hireDate: formatDateForInput(user.hireDate),
    endDate: formatDateForInput(user.endDate),
    notes: user.notes ?? "",
    validatorNotifyChannel: user.validatorNotifyChannel ?? "sms",
    isActive: user.isActive,
    changePassword: false,
    password: "",
    confirmPassword: "",
  };
}

const optionalStringFields = [
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
] as const;

function applySharedFields(
  values: CreateUserFormValues | EditUserFormValues,
  payload: Record<string, unknown>,
  unset: Record<string, 1>,
) {
  for (const key of optionalStringFields) {
    const value = values[key]?.trim();
    if (!value) {
      unset[key] = 1;
      continue;
    }

    if (key === "phone" || key === "phoneSecondary") {
      payload[key] = normalizeSenegalPhone(value);
    } else {
      payload[key] = value;
    }
  }

  if (values.gender) payload.gender = values.gender;
  else unset.gender = 1;

  if (values.maritalStatus) payload.maritalStatus = values.maritalStatus;
  else unset.maritalStatus = 1;

  if (values.contractType) payload.contractType = values.contractType;
  else unset.contractType = 1;

  if (values.contractType) {
    payload.contractYear = resolveUserContractYear({
      contractYear: values.contractYear,
      hireDate: values.hireDate,
    });
  } else {
    unset.contractYear = 1;
  }

  if (canBeAbsenceValidator(values.role as UserRole)) {
    payload.validatorNotifyChannel =
      values.validatorNotifyChannel === "email" ? "email" : "sms";
  } else {
    unset.validatorNotifyChannel = 1;
  }

  const children = values.numberOfChildren?.trim();
  if (children && !Number.isNaN(Number(children))) {
    payload.numberOfChildren = Number(children);
  } else {
    unset.numberOfChildren = 1;
  }
}

export function buildCreatePayload(values: CreateUserFormValues) {
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

  const unset: Record<string, 1> = {};
  applySharedFields(values, payload, unset);

  return { payload, unset };
}

export function buildUpdatePayload(values: EditUserFormValues) {
  const payload: Record<string, unknown> = {
    email: values.email.trim().toLowerCase(),
    firstname: values.firstname.trim(),
    lastname: values.lastname.trim(),
    section: values.section,
    role: values.role,
    occupation: values.occupation.trim(),
    isActive: values.isActive,
  };

  const unset: Record<string, 1> = {};
  applySharedFields(values, payload, unset);

  if (values.changePassword && values.password) {
    payload.password = values.password;
    payload.mustChangePassword = false;
  }

  return { payload, unset };
}
