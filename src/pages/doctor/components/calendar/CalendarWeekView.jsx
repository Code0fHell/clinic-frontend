import React from "react";
import dayjs from "dayjs";
import {
    parseUTCDate,
    formatUTCTime,
} from "../../../../utils/dateUtils";

const hours = Array.from({ length: 14 }, (_, i) => 8 + i); // 8h → 21h
const weekdays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];

const getWeekDates = (date) => {
    const startOfWeek = dayjs(date).startOf("week").add(1, "day"); // Bắt đầu từ Thứ 2
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
};

const CalendarWeekView = ({ appointments, current }) => {
    const weekDates = getWeekDates(current);

    const getAppointmentsByDayHour = (date, hour) =>
        appointments.filter((a) => {
            if (!a.scheduled_date) return false;
            const apptDate = parseUTCDate(a.scheduled_date);
            if (!apptDate) return false;
            // Get hour from appointment (stored as local time in backend)
            const apptHour = apptDate.hour();
            // Compare appointment date with calendar date (both in local time)
            return apptDate.isSame(dayjs(date), "day") && apptHour === hour;
        });

    const isToday = (date) => date.isSame(dayjs(), 'day');

    return (
        <div className="border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-8 text-sm min-w-[900px]">
                {/* Header */}
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 font-bold text-center border-r-2 border-b-2 border-gray-300 py-3 sticky top-0 z-10">
                    <svg className="w-5 h-5 mx-auto mb-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">Giờ</span>
                </div>
                {weekDates.map((date, idx) => {
                    const today = isToday(date);
                    return (
                        <div
                            key={idx}
                            className={`font-bold text-center border-r-2 border-b-2 border-gray-300 py-3 sticky top-0 z-10 ${
                                today 
                                    ? "bg-[#00796B] text-white shadow-md" 
                                    : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700"
                            }`}
                        >
                            <div className="text-xs mb-1">{weekdays[idx]}</div>
                            <div className={`text-lg font-extrabold ${today ? "text-white" : "text-gray-800"}`}>
                                {date.format("DD")}
                            </div>
                            <div className={`text-xs ${today ? "text-teal-100" : "text-gray-500"}`}>
                                {date.format("MM/YYYY")}
                            </div>
                        </div>
                    );
                })}

                {/* Body */}
                {hours.map((hour, hourIdx) => (
                    <React.Fragment key={hour}>
                        <div className={`text-center border-r-2 border-b border-gray-200 py-3 font-semibold ${
                            hourIdx % 2 === 0 ? "bg-slate-50" : "bg-white"
                        }`}>
                            <div className="text-base text-gray-700">{hour}:00</div>
                            <div className="text-xs text-gray-400">{hour + 1}:00</div>
                        </div>
                        {weekDates.map((date, idx) => {
                            const appts = getAppointmentsByDayHour(date, hour);
                            const today = isToday(date);
                            return (
                                <div
                                    key={idx}
                                    className={`relative border-r-2 border-b h-[70px] p-1.5 transition-all duration-200 hover:bg-teal-50/50 ${
                                        today ? "bg-teal-50/20" : hourIdx % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                                    }`}
                                >
                                    {appts.map((a) => {
                                        const startUTC = parseUTCDate(
                                            a.scheduled_date
                                        );
                                        const endUTC = startUTC.add(
                                            a.duration || 30,
                                            "minute"
                                        );
                                        const colorConfig =
                                            a.status === "CHECKED_IN"
                                                ? { bg: "bg-[#00796B]", shadow: "shadow-md", border: "border-teal-600" }
                                                : a.status === "PENDING"
                                                ? { bg: "bg-amber-500", shadow: "shadow-md", border: "border-amber-600" }
                                                : a.status === "COMPLETED"
                                                ? { bg: "bg-blue-500", shadow: "shadow-md", border: "border-blue-600" }
                                                : { bg: "bg-gray-400", shadow: "shadow-md", border: "border-gray-500" };
                                        return (
                                            <div
                                                key={a.id}
                                                className={`absolute top-1.5 left-1.5 right-1.5 rounded-lg ${colorConfig.bg} text-white text-[11px] px-2.5 py-1.5 ${colorConfig.shadow} border-l-4 ${colorConfig.border} cursor-pointer hover:opacity-90 transition-all duration-200`}
                                                title={a.patient?.patient_full_name}
                                            >
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                    <div className="font-semibold truncate">
                                                        {a.patient?.patient_full_name || "N/A"}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] opacity-90">
                                                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{formatUTCTime(startUTC)} - {formatUTCTime(endUTC)}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default CalendarWeekView;
