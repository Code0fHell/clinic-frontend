import React from "react";
import dayjs from "dayjs";
import { parseUTCDate, isSameDayUTC, formatUTCTime } from "../../../../utils/dateUtils";

const weekdays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];

const getMonthDates = (date) => {
  const start = dayjs(date).startOf("month").startOf("week").add(1, "day");
  const end = dayjs(date).endOf("month").endOf("week").add(1, "day");
  let curr = start;
  const weeks = [];
  while (curr.isBefore(end)) {
    weeks.push(Array.from({ length: 7 }, (_, i) => curr.add(i, "day")));
    curr = curr.add(7, "day");
  }
  return weeks;
};

const CalendarMonthView = ({ appointments, current }) => {
  const monthWeeks = getMonthDates(current);

  const getAppointmentsByDate = (date) =>
    appointments.filter((a) => {
      if (!a.scheduled_date) return false;
      return isSameDayUTC(a.scheduled_date, date);
    });

  const isToday = (date) => date.isSame(dayjs(), 'day');

  return (
    <div className="w-full h-full border-2 border-gray-300 rounded-xl bg-white overflow-hidden flex flex-col shadow-xl">
      {/* Header */}
      <div className="grid grid-cols-7 bg-[#00796B] text-sm font-bold border-b-2 border-teal-700 shadow-md">
        {weekdays.map((w, idx) => (
          <div
            key={idx}
            className="text-center py-4 border-r last:border-r-0 border-teal-600 text-white tracking-wide"
          >
            {w}
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 grid grid-rows-6">
        {monthWeeks.map((week, wIdx) => (
          <div key={wIdx} className="grid grid-cols-7 text-xs">
            {week.map((date, dIdx) => {
              const appts = getAppointmentsByDate(date);
              const isCurrentMonth = date.month() === current.month();
              const today = isToday(date);
              return (
                <div
                  key={dIdx}
                  className={`border-r-2 border-b-2 border-gray-200 p-2 min-h-[100px] transition-all duration-200 hover:bg-teal-50/50 ${
                    !isCurrentMonth 
                      ? "bg-gray-100/50 text-gray-400" 
                      : today
                      ? "bg-teal-50/40"
                      : "bg-white"
                  }`}
                >
                  <div className={`text-sm font-bold mb-2 flex items-center justify-between ${
                    today 
                      ? "text-teal-700" 
                      : isCurrentMonth 
                      ? "text-gray-800" 
                      : "text-gray-400"
                  }`}>
                    <span className={`${today ? "bg-[#00796B] text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md" : ""}`}>
                      {date.date()}
                    </span>
                    {appts.length > 0 && (
                      <span className="bg-[#00796B] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        {appts.length}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {appts.slice(0, 3).map((a) => {
                      const startUTC = parseUTCDate(a.scheduled_date);
                      const endUTC = startUTC.add(a.duration || 30, "minute");
                      const colorConfig =
                        a.status === "CHECKED_IN"
                          ? { bg: "bg-[#00796B]", shadow: "shadow-sm", border: "border-teal-600" }
                          : a.status === "PENDING"
                          ? { bg: "bg-amber-500", shadow: "shadow-sm", border: "border-amber-600" }
                          : a.status === "COMPLETED"
                          ? { bg: "bg-blue-500", shadow: "shadow-sm", border: "border-blue-600" }
                          : { bg: "bg-gray-400", shadow: "shadow-sm", border: "border-gray-500" };
                      return (
                        <div
                          key={a.id}
                          className={`rounded-lg ${colorConfig.bg} text-white text-[10px] px-2 py-1.5 truncate ${colorConfig.shadow} border-l-4 ${colorConfig.border} cursor-pointer hover:opacity-90 transition-all duration-200`}
                        >
                          <div className="flex items-center gap-1 mb-0.5">
                            <svg className="w-2.5 h-2.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <div className="truncate font-semibold">
                              {a.patient?.patient_full_name || "N/A"}
                            </div>
                          </div>
                          <div className="text-[9px] flex items-center gap-1 opacity-90">
                            <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {formatUTCTime(startUTC)} - {formatUTCTime(endUTC)}
                          </div>
                        </div>
                      );
                    })}
                    {appts.length > 3 && (
                      <div className="text-[10px] font-bold text-teal-700 mt-0.5 bg-teal-50 px-2 py-1 rounded-full text-center">
                        +{appts.length - 3} lịch khác
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarMonthView;
