import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { getAllAppointments } from "../../../../api/appointment.api";
import CalendarHeader from "./CalendarHeader";
import CalendarWeekView from "./CalendarWeekView";
import CalendarDayView from "./CalendarDayView";
import CalendarMonthView from "./CalendarMonthView";
import UpcomingAppointments from "./UpcomingAppointments";

const AppointmentCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [view, setView] = useState("week");
  const [current, setCurrent] = useState(dayjs());
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAllAppointments();
        setAppointments(data);

        const now = dayjs();
        const upcomingList = data
          .filter((a) => a.scheduled_date && dayjs(a.scheduled_date).isAfter(now))
          .sort((a, b) => dayjs(a.scheduled_date) - dayjs(b.scheduled_date))
          .slice(0, 5);
        setUpcoming(upcomingList);
      } catch (err) {
        console.error("Lỗi khi tải lịch hẹn:", err);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="flex gap-6 px-6 pt-[20px] bg-gray-50 min-h-screen ml-[50px]">
      {/* Lịch chính */}
      <div className="flex-1 min-w-0 bg-white rounded-xl shadow p-4">
        <CalendarHeader view={view} setView={setView} current={current} setCurrent={setCurrent} />

        <div className="mt-4 rounded-lg p-2">
          {view === "week" && <CalendarWeekView appointments={appointments} current={current} />}
          {view === "month" && <CalendarMonthView appointments={appointments} current={current} />}
          {view === "day" && <CalendarDayView appointments={appointments} current={current} />}
        </div>
      </div>

      {/* Lịch sắp tới */}
      <UpcomingAppointments upcoming={upcoming} />
    </div>
  );
};

export default AppointmentCalendar;
