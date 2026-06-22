export const LOGIN_FAILURE_LABELS: Record<string, string> = {
  user_not_found: "Utilisateur inconnu",
  account_disabled: "Compte désactivé",
  invalid_password: "Mot de passe incorrect",
  access_denied: "Accès refusé au tableau de bord",
};

export function getLoginFailureLabel(reason?: string): string {
  if (!reason) return "Échec de connexion";
  return LOGIN_FAILURE_LABELS[reason] ?? reason;
}
