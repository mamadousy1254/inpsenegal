import mongoose, { Schema, type Document, models } from "mongoose";
import { CANDIDATURE_STATUSES, type CandidatureStatus } from "@/lib/constants/candidature";

export interface ICandidature extends Document {
  reference: string;
  offreSlug: string;
  offreReference?: string;
  offreTitle?: string;
  isSpontanee: boolean;
  civilite: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  adresse: string;
  telephone: string;
  email: string;
  niveauEtude: string;
  domaineExpertise: string;
  anneesExperience: string;
  cvUrl?: string;
  cvPublicId?: string;
  cvFileName?: string;
  lettreMotivationUrl?: string;
  lettreMotivationPublicId?: string;
  lettreMotivationFileName?: string;
  message?: string;
  consentementDonnees: boolean;
  status: CandidatureStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const candidatureSchema = new Schema<ICandidature>(
  {
    reference: { type: String, required: true, unique: true, trim: true },
    offreSlug: { type: String, required: true, trim: true },
    offreReference: { type: String, trim: true },
    offreTitle: { type: String, trim: true },
    isSpontanee: { type: Boolean, default: false },
    civilite: { type: String, required: true, trim: true },
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    dateNaissance: { type: String, required: true, trim: true },
    lieuNaissance: { type: String, required: true, trim: true },
    nationalite: { type: String, required: true, trim: true },
    adresse: { type: String, required: true, trim: true },
    telephone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    niveauEtude: { type: String, required: true, trim: true },
    domaineExpertise: { type: String, required: true, trim: true },
    anneesExperience: { type: String, required: true, trim: true },
    cvUrl: { type: String, trim: true },
    cvPublicId: { type: String, trim: true },
    cvFileName: { type: String, trim: true },
    lettreMotivationUrl: { type: String, trim: true },
    lettreMotivationPublicId: { type: String, trim: true },
    lettreMotivationFileName: { type: String, trim: true },
    message: { type: String, trim: true },
    consentementDonnees: { type: Boolean, required: true },
    status: { type: String, enum: CANDIDATURE_STATUSES, default: "nouvelle" },
    adminNotes: { type: String, trim: true },
  },
  { timestamps: true },
);

candidatureSchema.index({ status: 1, createdAt: -1 });
candidatureSchema.index({ offreSlug: 1 });
candidatureSchema.index({ email: 1 });

const CandidatureModel =
  models.Candidature || mongoose.model<ICandidature>("Candidature", candidatureSchema);

export default CandidatureModel;
