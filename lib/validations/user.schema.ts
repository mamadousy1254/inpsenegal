import { z } from "zod";
import {
  CONTRACT_TYPES,
  GENDERS,
  MARITAL_STATUSES,
  USER_ROLES,
} from "@/lib/permissions/roles";
import { SENEGAL_REGIONS } from "@/lib/constants/senegal-regions";

export const createUserSchema = z.object({
  username: z.string().trim().toLowerCase().optional().or(z.literal("")),
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  firstname: z.string().trim().min(1, "Le prénom est requis"),
  lastname: z.string().trim().min(1, "Le nom est requis"),
  phone: z.string().trim().optional(),
  phoneSecondary: z.string().trim().optional(),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  gender: z.enum(GENDERS).optional(),
  maritalStatus: z.enum(MARITAL_STATUSES).optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().trim().optional(),
  nationalId: z.string().trim().optional(),
  numberOfChildren: z.coerce.number().min(0).optional(),
  matricule: z.string().trim().optional(),
  occupation: z.string().trim().min(1, "La fonction est requise"),
  service: z.string().trim().optional(),
  direction: z.string().trim().optional(),
  section: z.enum(SENEGAL_REGIONS),
  contractType: z.enum(CONTRACT_TYPES).optional(),
  hireDate: z.string().optional(),
  endDate: z.string().optional(),
  grade: z.string().trim().optional(),
  role: z.enum(USER_ROLES).default("employe"),
  managerId: z.string().optional(),
  isActive: z.boolean().default(true),
  mustChangePassword: z.boolean().default(false),
  notes: z.string().trim().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
