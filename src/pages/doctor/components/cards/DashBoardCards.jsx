import React, { useEffect, useState } from "react";
import { getTodayAppointments } from "../../../../api/appointment.api";
import { getTodayVisitQueue } from "../../../../api/visit.api";

const DashboardCards = () => {
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy tổng số lịch hẹn hôm nay
        const appointments = await getTodayAppointments();
        setAppointmentCount(appointments.length || 0);

        // Lấy tổng lượt thăm khám thực tế trong ngày
        const visits = await getTodayVisitQueue();
        setVisitCount(visits.length || 0);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", err);
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      title: "Lịch hẹn hôm nay",
      value: appointmentCount,
      color: "text-blue-600",
      change: "",
    },
    {
      title: "Lượt thăm khám thực tế",
      value: visitCount,
      color: "text-green-600",
      change: "",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl shadow p-6 flex flex-col items-start hover:shadow-md transition-all duration-150"
        >
          <div className="text-gray-500 mb-2">{card.title}</div>
          <div className={`text-3xl font-bold mb-1 ${card.color}`}>
            {card.value}
          </div>
          {card.change && (
            <div className={`flex items-center text-sm ${card.color}`}>
              <span>{card.change}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
