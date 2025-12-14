import React, { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { getAllAppointments } from "../../../../api/appointment.api";
import { parseUTCDate, getCurrentUTC } from "../../../../utils/dateUtils";
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

  const fetchAppointments = useCallback(async () => {
    try {
      const data = await getAllAppointments();
      setAppointments(data);

      const now = getCurrentUTC();
      const upcomingList = data
        .filter((a) => {
          if (!a.scheduled_date) return false;
          const apptUTC = parseUTCDate(a.scheduled_date);
          return apptUTC && apptUTC.isAfter(now);
        })
        .sort((a, b) => {
          const dateA = parseUTCDate(a.scheduled_date);
          const dateB = parseUTCDate(b.scheduled_date);
          return dateA.valueOf() - dateB.valueOf();
        })
        .slice(0, 5);
      setUpcoming(upcomingList);
    } catch (err) {
      console.error("Lỗi khi tải lịch hẹn:", err);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();

    const onFocus = () => fetchAppointments();
    const onVisibility = () => {
      if (!document.hidden) fetchAppointments();
    };
    const intervalId = setInterval(fetchAppointments, 20000);

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchAppointments]);

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
