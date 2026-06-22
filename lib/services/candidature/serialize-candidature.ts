import type { ICandidature } from "@/lib/mongo/models/candidature.model";

export type SerializedCandidature = {
  _id: string;
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
  cvFileName?: string;
  lettreMotivationUrl?: string;
  lettreMotivationFileName?: string;
  message?: string;
  status: ICandidature["status"];
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
};

export function serializeCandidature(
  item: ICandidature | Record<string, unknown>,
): SerializedCandidature {
  const doc = item as ICandidature;
  return {
    _id: String(doc._id),
    reference: doc.reference,
    offreSlug: doc.offreSlug,
    offreReference: doc.offreReference,
    offreTitle: doc.offreTitle,
    isSpontanee: doc.isSpontanee,
    civilite: doc.civilite,
    nom: doc.nom,
    prenom: doc.prenom,
    dateNaissance: doc.dateNaissance,
    lieuNaissance: doc.lieuNaissance,
    nationalite: doc.nationalite,
    adresse: doc.adresse,
    telephone: doc.telephone,
    email: doc.email,
    niveauEtude: doc.niveauEtude,
    domaineExpertise: doc.domaineExpertise,
    anneesExperience: doc.anneesExperience,
    cvUrl: doc.cvUrl,
    cvFileName: doc.cvFileName,
    lettreMotivationUrl: doc.lettreMotivationUrl,
    lettreMotivationFileName: doc.lettreMotivationFileName,
    message: doc.message,
    status: doc.status,
    adminNotes: doc.adminNotes,
    createdAt: doc.createdAt?.toISOString?.() ?? String(doc.createdAt),
    updatedAt: doc.updatedAt?.toISOString?.() ?? String(doc.updatedAt),
  };
}
