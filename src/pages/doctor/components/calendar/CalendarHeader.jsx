import React from "react";
import dayjs from "dayjs";

const getWeekDates = (date) => {
  const startOfWeek = dayjs(date).startOf("week").add(1, "day");
  return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
};

const CalendarHeader = ({ view, setView, current, setCurrent }) => {
  const handlePrev = () =>
    setCurrent((prev) =>
      view === "month"
        ? prev.subtract(1, "month")
        : view === "week"
        ? prev.subtract(1, "week")
        : prev.subtract(1, "day")
    );

  const handleNext = () =>
    setCurrent((prev) =>
      view === "month"
        ? prev.add(1, "month")
        : view === "week"
        ? prev.add(1, "week")
        : prev.add(1, "day")
    );

  const handleToday = () => setCurrent(dayjs());

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {["day", "week", "month"].map((v) => (
          <button
            key={v}
            className={`px-3 py-1 rounded ${view === v ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            onClick={() => setView(v)}
          >
            {v === "day" ? "Ngày" : v === "week" ? "Tuần" : "Tháng"}
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <button className="px-2 py-1 bg-gray-100 rounded" onClick={handleToday}>Hôm nay</button>
        <button className="px-2 py-1 bg-gray-100 rounded" onClick={handlePrev}>Trước</button>
        <button className="px-2 py-1 bg-gray-100 rounded" onClick={handleNext}>Sau</button>

        <span className="ml-4 font-semibold text-lg">
          {view === "month"
            ? `Tháng ${current.month() + 1} ${current.year()}`
            : view === "week"
            ? `Tuần ${getWeekDates(current)[0].format("DD/MM")} - ${getWeekDates(current)[6].format("DD/MM")}`
            : current.format("DD/MM/YYYY")}
        </span>
      </div>
    </div>
  );
};

export default CalendarHeader;
