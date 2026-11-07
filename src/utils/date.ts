// Three-letter months throughout: en-AU's toLocaleDateString gives "Sept",
// "June" and "July", which sit unevenly beside "Mar" and "Nov" in date lists.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
