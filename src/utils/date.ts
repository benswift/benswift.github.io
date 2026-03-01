export function formatDate(date: Date, shortYear = false): string {
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: shortYear ? "2-digit" : "numeric",
  });
}

export function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

export function formatDateFromString(dateStr: string, shortYear = false): string {
  return formatDate(parseDate(dateStr), shortYear);
}
