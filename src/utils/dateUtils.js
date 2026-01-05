import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/vi";

// Extend dayjs with UTC and timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("vi");

/**
 * Convert UTC dayjs object to local dayjs object
 * @param {dayjs.Dayjs} utcDate - UTC dayjs object
 * @returns {dayjs.Dayjs} - Local dayjs object
 */
const toLocal = (utcDate) => {
    if (!utcDate || !utcDate.isValid()) return null;
    // Convert UTC to local by converting to native Date (which is in local time) and back to dayjs
    return dayjs(utcDate.toDate());
};

/**
 * Parse a date string from the backend (stored as local time, not UTC)
 * @param {string} dateStr - Date string from backend (in local time format)
 * @returns {dayjs.Dayjs} - dayjs object in local time
 */
export const parseUTCDate = (dateStr) => {
    if (!dateStr) return null;
    // Parse as local time (backend stores local time, not UTC)
    // Example: "2025-01-06T08:00:00" should be 8:00 AM, not 8:00 AM UTC
    return dayjs(dateStr);
};

/**
 * Format date for display (using local time, matches backend storage)
 * @param {string|dayjs.Dayjs} date - Date string or dayjs object
 * @param {string} format - dayjs format string
 * @returns {string} - Formatted date string in local time (matches backend)
 */
export const formatUTCDate = (date, format = "DD/MM/YYYY HH:mm") => {
    if (!date) return "";
    const localDate = typeof date === "string" ? dayjs(date) : date;
    if (!localDate || !localDate.isValid()) return "";
    // Format local time directly (backend stores as local time)
    return localDate.format(format);
};

/**
 * Format time only (using local time, matches backend storage)
 * @param {string|dayjs.Dayjs} date - Date string or dayjs object
 * @returns {string} - Formatted time string in local time (matches backend)
 */
export const formatUTCTime = (date) => {
    if (!date) return "";
    const localDate = typeof date === "string" ? dayjs(date) : date;
    if (!localDate || !localDate.isValid()) return "";
    // Format local time directly (backend stores as local time)
    return localDate.format("HH:mm");
};

/**
 * Format date only (using local time, matches backend storage)
 * @param {string|dayjs.Dayjs} date - Date string or dayjs object
 * @returns {string} - Formatted date string in local time (matches backend)
 */
export const formatUTCDateOnly = (date) => {
    if (!date) return "";
    const localDate = typeof date === "string" ? dayjs(date) : date;
    if (!localDate || !localDate.isValid()) return "";
    // Format local date directly (backend stores as local time)
    return localDate.format("DD/MM/YYYY");
};

/**
 * Check if two dates are on the same day (local time comparison)
 * @param {string|dayjs.Dayjs} date1 - Date string or dayjs object
 * @param {dayjs.Dayjs} date2 - Local dayjs object
 * @returns {boolean}
 */
export const isSameDayUTC = (date1, date2) => {
    if (!date1 || !date2) return false;
    const d1 = typeof date1 === "string" ? dayjs(date1) : date1;
    if (!d1 || !d1.isValid()) return false;
    const d2 = dayjs(date2);
    if (!d2 || !d2.isValid()) return false;
    // Compare days in local time (backend stores as local time)
    return d1.isSame(d2, "day");
};

/**
 * Get hour from date (using local time, matches backend storage)
 * @param {string|dayjs.Dayjs} date - Date string or dayjs object
 * @returns {number} - Hour in local time (matches backend)
 */
export const getLocalHour = (date) => {
    if (!date) return null;
    const localDate = typeof date === "string" ? dayjs(date) : date;
    if (!localDate || !localDate.isValid()) return null;
    // Return local hour directly (backend stores as local time)
    return localDate.hour();
};

/**
 * Get current date/time in local timezone
 * @returns {dayjs.Dayjs} - Current local time
 */
export const getCurrentUTC = () => {
    return dayjs();
};
