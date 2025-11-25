import { parseUTCDate, formatUTCDateOnly, formatUTCTime } from "./dateUtils";

export function formatDateShort(dateStr) {
  if (!dateStr) return "";
  const utcDate = parseUTCDate(dateStr);
  if (!utcDate) return "";
  return utcDate.local().format("DD/MM");
}

export function formatWeekday(dateStr, locale = 'vi-VN') {
  if (!dateStr) return "";
  const utcDate = parseUTCDate(dateStr);
  if (!utcDate) return "";
  return utcDate.local().format("ddd");
}

export function formatTime(dateStr) {
  if (!dateStr) return "";
  return formatUTCTime(dateStr);
}