import React from "react";
import dayjs from "dayjs";

const UpcomingAppointments = ({ upcoming }) => (
  <div className="w-[320px] shrink-0">
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-base">Lịch sắp tới</span>
      </div>

      {upcoming.length === 0 ? (
        <div className="text-gray-400 text-sm">Không có lịch sắp tới</div>
      ) : (
        upcoming.map((a) => (
          <div key={a.id} className="bg-gray-50 rounded p-3 mb-3 border border-gray-100">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-sm">{dayjs(a.scheduled_date).format("DD/MM/YYYY")}</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                {dayjs(a.scheduled_date).format("HH:mm")} -{" "}
                {dayjs(a.scheduled_date).add(a.duration || 30, "minute").format("HH:mm")}
              </span>
            </div>
            <div className="font-semibold text-sm truncate">{a.reason || "Lịch hẹn"}</div>
            <div className="text-xs text-gray-500 truncate">{a.patient?.patient_full_name}</div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default UpcomingAppointments;
