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
    <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 shadow-sm">
      <div className="flex gap-3">
        {["day", "week", "month"].map((v) => (
          <button
            key={v}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              view === v
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200"
            }`}
            onClick={() => setView(v)}
          >
            <div className="flex items-center gap-2">
              {v === "day" && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              {v === "week" && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )}
              {v === "month" && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              )}
              <span>{v === "day" ? "Ngày" : v === "week" ? "Tuần" : "Tháng"}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 items-center">
        <button 
          className="px-4 py-2.5 bg-white text-gray-700 rounded-lg font-medium hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 hover:text-white hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-transparent"
          onClick={handleToday}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Hôm nay</span>
          </div>
        </button>
        
        <div className="flex gap-2">
          <button 
            className="px-3 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 border border-gray-200 hover:border-blue-300 hover:shadow-md"
            onClick={handlePrev}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            className="px-3 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 border border-gray-200 hover:border-blue-300 hover:shadow-md"
            onClick={handleNext}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="ml-4 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold text-lg shadow-lg shadow-indigo-500/30">
          {view === "month"
            ? `Tháng ${current.month() + 1} ${current.year()}`
            : view === "week"
            ? `${getWeekDates(current)[0].format("DD/MM")} - ${getWeekDates(current)[6].format("DD/MM")}`
            : current.format("DD/MM/YYYY")}
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
