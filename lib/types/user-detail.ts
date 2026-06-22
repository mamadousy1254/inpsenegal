import type {
  ContractType,
  Gender,
  MaritalStatus,
  UserRole,
} from "@/lib/permissions/roles";

export type UserDetail = {
  _id: string;
  username?: string;
  email: string;
  firstname: string;
  lastname: string;
  avatar?: string;
  phone?: string;
  phoneSecondary?: string;
  address?: string;
  city?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  dateOfBirth?: string;
  nationality?: string;
  nationalId?: string;
  numberOfChildren?: number;
  matricule?: string;
  occupation: string;
  service?: string;
  direction?: string;
  section: string;
  contractType?: ContractType;
  contractYear?: number;
  hireDate?: string;
  endDate?: string;
  grade?: string;
  role: UserRole;
  validatorNotifyChannel?: "sms" | "email";
  isActive: boolean;
  emailVerified: boolean;
  mustChangePassword: boolean;
  lastLoginAt?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};
