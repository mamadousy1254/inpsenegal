/** Numéro sénégalais : +221 suivi de 9 chiffres */
export const SENEGAL_PHONE_REGEX = /^\+221[0-9]{9}$/;

export function normalizeSenegalPhone(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, "");

  if (cleaned.startsWith("+221")) return cleaned;
  if (cleaned.startsWith("221")) return `+${cleaned}`;
  if (/^[0-9]{9}$/.test(cleaned)) return `+221${cleaned}`;

  return cleaned;
}

export function isValidSenegalPhone(phone: string): boolean {
  return SENEGAL_PHONE_REGEX.test(normalizeSenegalPhone(phone));
}
