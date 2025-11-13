import React from "react";
import dayjs from "dayjs";

const hours = Array.from({ length: 11 }, (_, i) => 8 + i); // 8h → 18h
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
      const appt = dayjs(a.scheduled_date);
      return appt.isSame(date, "day") && appt.hour() === hour;
    });

  return (
    <div className="border border-gray-200 rounded-lg">
      <div className="grid grid-cols-8 text-xs min-w-[900px]">
        {/* Header */}
        <div className="bg-gray-100 font-semibold text-center border-r border-b py-2">Giờ</div>
        {weekDates.map((date, idx) => (
          <div key={idx} className="bg-gray-100 font-semibold text-center border-r border-b py-2">
            {weekdays[idx]} <span className="text-gray-500">{date.format("DD/MM")}</span>
          </div>
        ))}

        {/* Body */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="text-center border-r border-b py-2 text-gray-600">{hour}:00</div>
            {weekDates.map((date, idx) => {
              const appts = getAppointmentsByDayHour(date, hour);
              return (
                <div key={idx} className="relative border-r border-b h-[60px] p-1">
                  {appts.map((a) => {
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
                        className={`absolute top-1 left-1 right-1 rounded ${color} text-white text-[11px] px-2 py-1`}
                        title={a.patient?.patient_full_name}
                      >
                        <div className="font-medium truncate">{a.patient?.patient_full_name || "N/A"}</div>
                        <div className="text-[10px]">
                          {start.format("HH:mm")} - {end.format("HH:mm")}
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
