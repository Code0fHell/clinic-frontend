import React, { useEffect, useState } from "react";
import { getTodayAppointments } from "../../../../api/appointment.api";

const AppointmentTable = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getTodayAppointments();
        setAppointments(data);
      } catch (err) {
        console.error("Lỗi khi tải lịch hẹn hôm nay:", err);
      }
    };
    fetchAppointments();
  }, []);

  // Hàm ánh xạ trạng thái lịch hẹn sang tiếng Việt + màu sắc
  const getStatusInfo = (status) => {
    switch (status) {
      case "PENDING":
        return { label: "Chưa checkin", className: "bg-yellow-100 text-yellow-700" };
      case "CHECKED_IN":
        return { label: "Đã checkin", className: "bg-green-100 text-green-700" };
      case "CANCELLED":
        return { label: "Đã hủy", className: "bg-red-100 text-red-700" };
      case "COMPLETED":
        return { label: "Đã xong", className: "bg-blue-100 text-blue-700" };
      default:
        return { label: "Không xác định", className: "bg-gray-100 text-gray-700" };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Lịch hẹn hôm nay</h2>
        <button className="text-blue-600 text-sm font-medium hover:underline">
          Xem tất cả
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-500">
              <th className="pb-3 font-medium">Bệnh nhân</th>
              <th className="pb-3 font-medium">Lý do</th>
              <th className="pb-3 font-medium">Thời gian</th>
              <th className="pb-3 font-medium text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a, idx) => {
              const { label, className } = getStatusInfo(a.status);
              return (
                <tr
                  key={a.id || idx}
                  className="bg-gray-50 hover:bg-blue-50 transition-all duration-150 rounded-xl"
                >
                  <td className="py-3 px-3 font-medium text-gray-800 rounded-l-xl">
                    {a.patient?.patient_full_name || "N/A"}
                  </td>
                  <td className="py-3 text-gray-600">{a.reason || "--"}</td>
                  <td className="py-3 text-gray-600">
                    {new Date(
                      a.scheduled_date || a.appointment_date
                    ).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}
                  </td>
                  <td className="py-3 text-right pr-3 rounded-r-xl">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${className}`}
                    >
                      {label}
                    </span>
                  </td>
                </tr>
              );
            })}
            {appointments.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-400 py-4">
                  Không có lịch hẹn nào hôm nay
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentTable;
