import moment from "moment";
import "moment/locale/ar";

export function formatDateTime(
  date: string | Date,
  locale: string,
  showTime: boolean = false,
): string {
  const m = moment(date).locale(locale);
  return showTime
    ? m.format("D MMMM YYYY, h:mm A") // with time
    : m.format("D MMMM YYYY"); // date only
}
