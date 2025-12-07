import React, { useEffect, useState } from "react";
import { getTodayVisitQueue, updateVisitStatus } from "../../../api/visit.api";
import { updateAppointmentStatus } from "../../../api/appointment.api";
import dayjs from "dayjs";
import { formatUTCTime } from "../../../utils/dateUtils";

const UpcomingSchedule = () => {
  const [queue, setQueue] = useState([]);

  // Lấy danh sách bệnh nhân trong hàng chờ khám hôm nay
  const fetchQueue = async () => {
    try {
      const data = await getTodayVisitQueue();
      setQueue(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách chờ khám:", err);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  // Xử lý khi bác sĩ nhấn “Bắt đầu khám”
  const handleStartVisit = async (visitId) => {
    try {
      await updateVisitStatus(visitId, "DOING");
      setQueue((prev) =>
        prev.map((v) =>
          v.id === visitId ? { ...v, visit_status: "DOING" } : v
        )
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái visit:", err);
    }
  };

  // Xử lý khi bác sĩ nhấn “Đã khám xong”
  const handleCompleteVisit = async (visitId, appointmentId) => {
    try {
      await updateVisitStatus(visitId, "COMPLETED");
      if (appointmentId) {
        await updateAppointmentStatus(appointmentId, "COMPLETED");
      }
      setQueue((prev) =>
        prev.map((v) =>
          v.id === visitId ? { ...v, visit_status: "COMPLETED", appointment: { ...v.appointment, status: "COMPLETED" } } : v
        )
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái hoàn thành:", err);
    }
  };

  return (
    <div className="w-[360px]">
      <div className="bg-white rounded-2xl shadow p-6 h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Danh sách chờ khám hôm nay
          </h2>
          <button
            onClick={fetchQueue}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Làm mới
          </button>
        </div>

        {/* Danh sách */}
        <div className="relative border-l-2 border-gray-200 pl-6">
          {queue.length > 0 ? (
            queue.map((v, idx) => {
              const time = formatUTCTime(v.appointment.scheduled_date);
              const patientName = v.patient?.patient_full_name || "Chưa rõ";
              const reason = v.appointment?.reason || v.visit_type || "--";
              const doctorName =
                v.doctor?.user?.full_name || v.doctor?.id || "Chưa rõ";
              const isNext = idx === 0;

              return (
                <div key={v.id} className="relative mb-6">
                  {/* Timeline dot */}
                  <span
                    className={`absolute -left-[7px] top-[6px] w-3 h-3 rounded-full ${
                      isNext ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  ></span>

                  {/* Card */}
                  <div
                    className={`ml-2 p-3 rounded-xl border transition ${
                      v.visit_status === "DOING"
                        ? "bg-green-50 border-green-300"
                        : "bg-gray-50 border-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-800 font-medium">
                        {time}
                      </span>
                      {v.visit_status === "DOING" && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-md">
                          Đang khám
                        </span>
                      )}
                      {v.visit_status === "COMPLETED" && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md">
                          Đã khám xong
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-blue-700">
                      {patientName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Lý do: {reason}
                    </p>
                    <p className="text-xs text-gray-400 mb-2">
                      Bác sĩ: {doctorName}
                    </p>

                    {/* Nút hành động */}
                    {v.visit_status === "CHECKED_IN" && (
                      <button
                        onClick={() => handleStartVisit(v.id)}
                        className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                      >
                        Bắt đầu khám
                      </button>
                    )}
                    {v.visit_status === "DOING" && (
                      <button
                        onClick={() => handleCompleteVisit(v.id, v.appointment?.id)}
                        className="mt-2 text-xs bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
                      >
                        Đã khám xong
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-sm ml-2">
              Không có bệnh nhân trong hàng chờ hôm nay
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingSchedule;