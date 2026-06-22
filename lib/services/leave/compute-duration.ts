/** Nombre de jours ouvrés (lun–ven) entre deux dates incluses. */
export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function computeBusinessDays(start: Date, end: Date): number {
  if (end < start) return 0;

  let count = 0;
  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);
  const endDay = new Date(end);
  endDay.setHours(0, 0, 0, 0);

  while (cursor <= endDay) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) count += 1;
    cursor.setDate(cursor.getDate() + 1);
  }

  return count;
}

export function computeBusinessDaysFromStrings(
  dateDepart: string,
  dateFin: string,
): number {
  if (!dateDepart || !dateFin) return 0;
  let start = parseLocalDate(dateDepart);
  let end = parseLocalDate(dateFin);
  if (start > end) {
    [start, end] = [end, start];
  }
  return computeBusinessDays(start, end);
}
