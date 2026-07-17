export function formatDateTime(
  date: string | Date,
  locale: string,
  showTime = false,
): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(showTime && {
      hour: "numeric",
      minute: "2-digit",
    }),
  }).format(new Date(date));
}