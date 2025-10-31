import React from "react";
import dayjs from "dayjs";

const hours = Array.from({ length: 11 }, (_, i) => 8 + i);

const CalendarDayView = ({ appointments, current }) => {
  const getAppointmentsByHour = (date, hour) =>
    appointments.filter((a) => {
      if (!a.scheduled_date) return false;
      const appt = dayjs(a.scheduled_date);
      return appt.isSame(date, "day") && appt.hour() === hour;
    });

  return (
    <div className="w-full h-full border border-gray-200 rounded-lg bg-white">
      <div className="grid grid-cols-[100px_1fr] text-xs h-full">
        {/* Header */}
        <div className="bg-gray-100 font-semibold text-center border-r border-b py-2">
          Giờ
        </div>
        <div className="bg-gray-100 font-semibold text-center border-b py-2">
          {dayjs(current).format("dddd DD/MM")}
        </div>

        {/* Body */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="text-center border-r border-b py-3 text-gray-600">
              {hour}:00
            </div>
            <div className="relative border-b h-[60px] p-1 bg-white">
              {getAppointmentsByHour(current, hour).map((a) => {
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
                    className={`absolute inset-x-1 top-1 rounded ${color} text-white text-xs px-2 py-1`}
                    title={a.patient?.patient_full_name}
                  >
                    <div className="font-medium truncate">
                      {a.patient?.patient_full_name || "N/A"}
                    </div>
                    <div className="text-[10px]">
                      {start.format("HH:mm")} - {end.format("HH:mm")}
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
