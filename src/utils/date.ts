export function formatDate(date: Date, shortYear = false): string {
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: shortYear ? "2-digit" : "numeric",
  });
}
