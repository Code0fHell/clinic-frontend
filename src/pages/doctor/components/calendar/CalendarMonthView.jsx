import React from "react";
import dayjs from "dayjs";

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
      return dayjs(a.scheduled_date).isSame(date, "day");
    });

  return (
    <div className="w-full h-full border border-gray-200 rounded-lg bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="grid grid-cols-7 bg-gray-100 text-xs font-semibold border-b border-gray-200">
        {weekdays.map((w, idx) => (
          <div
            key={idx}
            className="text-center py-2 border-r last:border-r-0 border-gray-200"
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
              return (
                <div
                  key={dIdx}
                  className={`border-r border-b border-gray-200 p-1 ${
                    !isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"
                  }`}
                >
                  <div className="text-[11px] font-semibold mb-1">{date.date()}</div>
                  <div className="flex flex-col gap-1">
                    {appts.slice(0, 3).map((a) => {
                      const start = dayjs(a.scheduled_date);
                      const end = dayjs(a.scheduled_date).add(a.duration || 30, "minute");
                      const color =
                        a.status === "CHECKED_IN"
                          ? "bg-green-500"
                          : a.status === "PENDING"
                          ? "bg-yellow-500"
                          : a.status === "COMPLETED"
                          ? "bg-blue-500"
                          : "bg-gray-400";
                      return (
                        <div
                          key={a.id}
                          className={`rounded ${color} text-white text-[10px] px-1 py-0.5 truncate`}
                        >
                          <div className="truncate">
                            {a.patient?.patient_full_name || "N/A"}
                          </div>
                          <div className="text-[9px]">
                            {start.format("HH:mm")} - {end.format("HH:mm")}
                          </div>
                        </div>
                      );
                    })}
                    {appts.length > 3 && (
                      <div className="text-[10px] text-blue-600 mt-0.5">
                        +{appts.length - 3} thêm
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
