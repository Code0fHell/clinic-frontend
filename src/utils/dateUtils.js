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
 * Parse a UTC date string from the backend
 * @param {string} dateStr - UTC date string from backend
 * @returns {dayjs.Dayjs} - dayjs object in UTC
 */
export const parseUTCDate = (dateStr) => {
    if (!dateStr) return null;
    // Parse as UTC and keep it in UTC
    return dayjs.utc(dateStr);
};

/**
 * Format UTC date for display (keeps UTC time, no conversion)
 * @param {string|dayjs.Dayjs} date - UTC date string or dayjs object
 * @param {string} format - dayjs format string
 * @returns {string} - Formatted date string in UTC (matches backend)
 */
export const formatUTCDate = (date, format = "DD/MM/YYYY HH:mm") => {
    if (!date) return "";
    const utcDate = typeof date === "string" ? dayjs.utc(date) : date;
    if (!utcDate || !utcDate.isValid()) return "";
    // Format UTC time directly without converting to local timezone
    return utcDate.format(format);
};

/**
 * Format UTC date time only (keeps UTC time, no conversion)
 * @param {string|dayjs.Dayjs} date - UTC date string or dayjs object
 * @returns {string} - Formatted time string in UTC (matches backend)
 */
export const formatUTCTime = (date) => {
    if (!date) return "";
    const utcDate = typeof date === "string" ? dayjs.utc(date) : date;
    if (!utcDate || !utcDate.isValid()) return "";
    // Format UTC time directly without converting to local timezone
    return utcDate.format("HH:mm");
};

/**
 * Format UTC date only (keeps UTC time, no conversion)
 * @param {string|dayjs.Dayjs} date - UTC date string or dayjs object
 * @returns {string} - Formatted date string in UTC (matches backend)
 */
export const formatUTCDateOnly = (date) => {
    if (!date) return "";
    const utcDate = typeof date === "string" ? dayjs.utc(date) : date;
    if (!utcDate || !utcDate.isValid()) return "";
    // Format UTC date directly without converting to local timezone
    return utcDate.format("DD/MM/YYYY");
};

/**
 * Check if UTC date is same as local date (day comparison in UTC)
 * @param {string|dayjs.Dayjs} utcDate - UTC date string or dayjs object
 * @param {dayjs.Dayjs} localDate - Local dayjs object (will be converted to UTC for comparison)
 * @returns {boolean}
 */
export const isSameDayUTC = (utcDate, localDate) => {
    if (!utcDate || !localDate) return false;
    const utc = typeof utcDate === "string" ? dayjs.utc(utcDate) : utcDate;
    if (!utc || !utc.isValid()) return false;
    const local = dayjs(localDate);
    if (!local || !local.isValid()) return false;
    // Convert local date to UTC and compare days in UTC
    const localAsUTC = dayjs.utc(local);
    return utc.isSame(localAsUTC, "day");
};

/**
 * Get hour from UTC date (keeps UTC hour, no conversion)
 * @param {string|dayjs.Dayjs} date - UTC date string or dayjs object
 * @returns {number} - Hour in UTC (matches backend)
 */
export const getLocalHour = (date) => {
    if (!date) return null;
    const utcDate = typeof date === "string" ? dayjs.utc(date) : date;
    if (!utcDate || !utcDate.isValid()) return null;
    // Return UTC hour directly without converting to local timezone
    return utcDate.hour();
};

/**
 * Get current date/time in UTC
 * @returns {dayjs.Dayjs} - Current UTC time
 */
export const getCurrentUTC = () => {
    return dayjs.utc();
};
