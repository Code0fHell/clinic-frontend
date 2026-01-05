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
    <div className="w-[360px] h-full flex flex-col">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border-2 border-blue-100 h-full flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  Danh sách chờ khám
                </h2>
                <p className="text-xs text-blue-100">Hôm nay</p>
              </div>
            </div>
            <button
              onClick={fetchQueue}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1 hover:shadow-lg"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Làm mới
            </button>
          </div>
          
          {/* Queue count badge */}
          {queue.length > 0 && (
            <div className="mt-3 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center justify-between">
              <span className="text-white text-sm font-medium">Tổng số bệnh nhân</span>
              <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold shadow">
                {queue.length}
              </span>
            </div>
          )}
        </div>

        {/* Danh sách - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100 hover:scrollbar-thumb-blue-500">
          {queue.length > 0 ? (
            <div className="relative border-l-2 border-blue-200 pl-6">
              {queue.map((v, idx) => {
                const time = v.appointment
                  ? formatUTCTime(v.appointment.scheduled_date)
                  : v.checked_in_at
                  ? formatUTCTime(v.checked_in_at)
                  : "--";
                const patientName = v.patient?.patient_full_name || "Chưa rõ";
                const reason = v.appointment?.reason || v.visit_type || "--";
                const doctorName =
                  v.doctor?.user?.full_name || v.doctor?.name || v.doctor?.id || "Chưa rõ";
                const isNext = idx === 0;

                return (
                  <div key={v.id} className="relative mb-5 last:mb-0">
                    {/* Timeline dot with animation */}
                    <span
                      className={`absolute -left-[7px] top-[6px] w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                        isNext 
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg animate-pulse" 
                          : v.visit_status === "DOING"
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-md"
                          : v.visit_status === "COMPLETED"
                          ? "bg-gradient-to-r from-purple-500 to-pink-600 shadow-md"
                          : "bg-gray-300"
                      }`}
                    >
                      {isNext && (
                        <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></span>
                      )}
                    </span>

                    {/* Card with enhanced styling */}
                    <div
                      className={`ml-2 p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 ${
                        v.visit_status === "DOING"
                          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-md"
                          : v.visit_status === "COMPLETED"
                          ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 shadow-md opacity-60"
                          : isNext
                          ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 shadow-md"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-gray-800 font-bold">
                            {time}
                          </span>
                        </div>
                        {v.visit_status === "DOING" && (
                          <span className="text-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2.5 py-1 rounded-full font-bold shadow-md flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                            Đang khám
                          </span>
                        )}
                        {v.visit_status === "COMPLETED" && (
                          <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-600 text-white px-2.5 py-1 rounded-full font-bold shadow-md">
                            ✓ Hoàn thành
                          </span>
                        )}
                        {isNext && v.visit_status === "CHECKED_IN" && (
                          <span className="text-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-2.5 py-1 rounded-full font-bold shadow-md animate-pulse">
                            Tiếp theo
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-indigo-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm font-bold text-indigo-700">
                          {patientName}
                        </p>
                      </div>
                      
                      <div className="flex items-start gap-2 mb-1">
                        <svg className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          <span className="font-semibold">Lý do:</span> {reason}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold">BS:</span> {doctorName}
                        </p>
                      </div>

                      {/* Nút hành động với styling đẹp hơn */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        {v.visit_status === "CHECKED_IN" && (
                          <button
                            onClick={() => handleStartVisit(v.id)}
                            className="w-full text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Bắt đầu khám
                          </button>
                        )}
                        {v.visit_status === "DOING" && (
                          <button
                            onClick={() => handleCompleteVisit(v.id, v.appointment?.id)}
                            className="w-full text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Đã khám xong
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-400 text-sm font-medium">
                Không có bệnh nhân trong hàng chờ
              </p>
              <p className="text-gray-300 text-xs mt-1">
                Danh sách sẽ tự động cập nhật
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingSchedule;