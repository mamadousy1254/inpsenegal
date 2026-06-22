export type CandidatureFormData = {
  offreSlug: string;
  offreReference?: string;
  offreTitle?: string;
  civilite: "M." | "Mme" | "Mlle" | string;
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
  cv: File | null;
  lettreMotivation: File | null;
  message: string;
  consentementDonnees: boolean;
};

export async function submitCandidature(
  data: CandidatureFormData,
): Promise<{ success: boolean; reference?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("offreSlug", data.offreSlug);
    if (data.offreReference) formData.append("offreReference", data.offreReference);
    if (data.offreTitle) formData.append("offreTitle", data.offreTitle);
    formData.append("civilite", data.civilite);
    formData.append("nom", data.nom);
    formData.append("prenom", data.prenom);
    formData.append("dateNaissance", data.dateNaissance);
    formData.append("lieuNaissance", data.lieuNaissance);
    formData.append("nationalite", data.nationalite);
    formData.append("adresse", data.adresse);
    formData.append("telephone", data.telephone);
    formData.append("email", data.email);
    formData.append("niveauEtude", data.niveauEtude);
    formData.append("domaineExpertise", data.domaineExpertise);
    formData.append("anneesExperience", data.anneesExperience);
    formData.append("message", data.message);
    formData.append("consentementDonnees", String(data.consentementDonnees));
    if (data.cv) formData.append("cv", data.cv);
    if (data.lettreMotivation) formData.append("lettreMotivation", data.lettreMotivation);

    const res = await fetch("/api/candidatures", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error ?? "Erreur lors de l'envoi" };
    }

    return { success: true, reference: json.reference };
  } catch {
    return { success: false, error: "Erreur réseau. Veuillez réessayer." };
  }
}
