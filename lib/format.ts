import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const UK_TZ = "Europe/London";

export function ukDate(iso: string) {
  return format(toZonedTime(new Date(iso), UK_TZ), "EEE d MMM");
}

export function ukTime(iso: string) {
  return format(toZonedTime(new Date(iso), UK_TZ), "HH:mm");
}

export function ukDateTime(iso: string) {
  return format(toZonedTime(new Date(iso), UK_TZ), "EEE d MMM, HH:mm");
}

export function countdown(iso: string, now = new Date()) {
  const diff = +new Date(iso) - +now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, past: false };
}
