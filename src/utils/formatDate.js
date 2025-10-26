export function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

export function formatWeekday(dateStr, locale = 'vi-VN') {
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale, { weekday: 'short' });
}

export function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}