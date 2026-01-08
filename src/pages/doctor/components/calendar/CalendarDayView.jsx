import React from "react";
import dayjs from "dayjs";
import {
    parseUTCDate,
    isSameDayUTC,
    getLocalHour,
    formatUTCTime,
} from "../../../../utils/dateUtils";

const hours = Array.from({ length: 14 }, (_, i) => 8 + i); // 8h → 21h

const CalendarDayView = ({ appointments, current }) => {
    const getAppointmentsByHour = (date, hour) =>
        appointments.filter((a) => {
            if (!a.scheduled_date) return false;
            const apptDate = parseUTCDate(a.scheduled_date);
            if (!apptDate) return false;
            // Get hour from appointment (stored as local time in backend)
            const apptHour = apptDate.hour();
            // Compare appointment date with calendar date (both in local time)
            return apptDate.isSame(dayjs(date), "day") && apptHour === hour;
        });

    return (
        <div className="w-full h-full border-2 border-gray-300 rounded-xl bg-white overflow-hidden shadow-xl">
            <div className="grid grid-cols-[120px_1fr] text-sm h-full">
                {/* Header */}
                <div className="bg-gradient-to-br from-slate-600 to-slate-700 font-bold text-center border-r-2 border-b-2 border-slate-800 py-4 text-white flex flex-col items-center justify-center">
                    <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Giờ
                </div>
                <div className="bg-[#00796B] font-bold text-center border-b-2 border-teal-700 py-4 text-white shadow-md">
                    <div className="text-base mb-1">{dayjs(current).format("dddd")}</div>
                    <div className="text-2xl font-extrabold">{dayjs(current).format("DD/MM/YYYY")}</div>
                </div>

                {/* Body */}
                {hours.map((hour, idx) => (
                    <React.Fragment key={hour}>
                        <div className={`text-center border-r-2 border-b border-gray-200 py-4 font-semibold ${
                            idx % 2 === 0 ? "bg-slate-50" : "bg-white"
                        }`}>
                            <div className="text-lg text-gray-700">{hour}:00</div>
                            <div className="text-xs text-gray-400">{hour + 1}:00</div>
                        </div>
                        <div className={`relative border-b h-[80px] p-2 transition-all duration-200 hover:bg-teal-50/50 ${
                            idx % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                        }`}>
                            {getAppointmentsByHour(current, hour).map((a) => {
                                const startUTC = parseUTCDate(a.scheduled_date);
                                const endUTC = startUTC.add(
                                    a.duration || 30,
                                    "minute"
                                );
                                const colorConfig =
                                    a.status === "CHECKED_IN"
                                        ? { bg: "bg-[#00796B]", shadow: "shadow-md", border: "border-teal-600", icon: "✓" }
                                        : a.status === "PENDING"
                                        ? { bg: "bg-amber-500", shadow: "shadow-md", border: "border-amber-600", icon: "⏱" }
                                        : a.status === "COMPLETED"
                                        ? { bg: "bg-blue-500", shadow: "shadow-md", border: "border-blue-600", icon: "✓" }
                                        : { bg: "bg-gray-400", shadow: "shadow-md", border: "border-gray-500", icon: "•" };
                                return (
                                    <div
                                        key={a.id}
                                        className={`absolute inset-x-2 top-2 rounded-lg ${colorConfig.bg} text-white text-sm px-4 py-2.5 ${colorConfig.shadow} border-l-4 ${colorConfig.border} cursor-pointer hover:opacity-90 transition-all duration-200`}
                                        title={a.patient?.patient_full_name}
                                    >
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className="bg-white/20 rounded-full p-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="font-bold truncate text-base">
                                                {a.patient?.patient_full_name || "N/A"}
                                            </div>
                                            <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
                                                {colorConfig.icon}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs opacity-90">
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                            <span className="font-semibold">
                                                {formatUTCTime(startUTC)} - {formatUTCTime(endUTC)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default CalendarDayView;
