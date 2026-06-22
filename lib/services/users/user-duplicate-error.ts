type MongoDuplicateError = {
  code?: number;
  keyPattern?: Record<string, number>;
  keyValue?: Record<string, unknown>;
};

export function getMongoUserDuplicateMessage(error: unknown): string | null {
  if (
    !error ||
    typeof error !== "object" ||
    (error as MongoDuplicateError).code !== 11000
  ) {
    return null;
  }

  const { keyPattern, keyValue } = error as MongoDuplicateError;

  if (keyPattern?.username) {
    const value = keyValue?.username;
    return typeof value === "string"
      ? `Le nom d'utilisateur « ${value} » est déjà utilisé.`
      : "Ce nom d'utilisateur est déjà utilisé.";
  }

  if (keyPattern?.email) {
    return "Un utilisateur avec cet e-mail existe déjà.";
  }

  if (keyPattern?.matricule) {
    const value = keyValue?.matricule;
    return typeof value === "string"
      ? `Le matricule « ${value} » est déjà utilisé.`
      : "Ce matricule est déjà utilisé.";
  }

  return "Ces informations sont déjà utilisées par un autre compte.";
}
