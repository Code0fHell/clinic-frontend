import React, { useState } from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    addDays,
    subDays,
    getDay,
    isSameMonth,
    isToday,
    addMonths,
    subMonths,
} from "date-fns";

// Rút gọn: T.2, T.3, ..., CN
const SHORT_DAYS = ["T.2", "T.3", "T.4", "T.5", "T.6", "T.7", "CN"];
const VIETNAMESE_MONTHS = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
];

export default function CalendarCard() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const today = new Date();

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    // Tiêu đề: Tháng X Năm YYYY
    const monthYear = `${VIETNAMESE_MONTHS[month]} ${year}`;

    // Hôm nay: chỉ hiện nếu cùng tháng
    const todayText = isSameMonth(today, currentDate)
        ? `Hôm nay: ${format(today, "dd/MM/yyyy")}`
        : "";

    // Tính ô trống đầu tháng (bắt đầu từ T.2)
    const startDayIndex = getDay(monthStart);
    const leadingEmptyCells = startDayIndex === 0 ? 6 : startDayIndex - 1;

    // Tổng 42 ô
    const totalCells = 42;
    const daysInMonth = monthEnd.getDate();
    const trailingEmptyCells = totalCells - (leadingEmptyCells + daysInMonth);

    // Tạo mảng ngày
    const calendarDays = [];

    // 1. Tháng trước
    for (let i = leadingEmptyCells - 1; i >= 0; i--) {
        calendarDays.push({ date: subDays(monthStart, i + 1), isCurrentMonth: false });
    }

    // 2. Tháng hiện tại
    eachDayOfInterval({ start: monthStart, end: monthEnd }).forEach((day) => {
        calendarDays.push({ date: day, isCurrentMonth: true });
    });

    // 3. Tháng sau
    for (let i = 1; i <= trailingEmptyCells; i++) {
        calendarDays.push({ date: addDays(monthEnd, i), isCurrentMonth: false });
    }

    const goToPrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    return (
        <div className="bg-white rounded-2xl shadow-sm p-5">
            {/* Header: Tháng + Hôm nay + Nút */}
            <div className="flex justify-between items-center mb-5 px-2">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{monthYear}</h2>
                </div>
                <div className="flex space-x-1">
                    <button
                        onClick={goToPrevMonth}
                        className="p-1 text-gray-400 hover:text-teal-600 transition-colors cursor-pointer rounded-full hover:bg-gray-100"
                        aria-label="Tháng trước"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={goToNextMonth}
                        className="p-1 text-gray-400 hover:text-teal-600 transition-colors cursor-pointer rounded-full hover:bg-gray-100"
                        aria-label="Tháng sau"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
            {/* Thứ: T.2 → CN – CÙNG 1 DÒNG */}
            <div className="flex justify-between text-base font-medium text-gray-600 mb-3 px-1">
                {SHORT_DAYS.map((day) => (
                    <span key={day} className="flex-1 text-center">
                        {day}
                    </span>
                ))}
            </div>

            {/* Lịch */}
            <div className="grid grid-cols-7 gap-y-1">
                {calendarDays.map((day, index) => {
                    const isCurrentDay = isToday(day.date);
                    const isCurrentMonth = day.isCurrentMonth;

                    return (
                        <div key={index} className="flex justify-center">
                            <div
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${isCurrentDay
                                    ? "bg-teal-600 text-white font-bold"
                                    : isCurrentMonth
                                        ? "text-gray-700 hover:bg-gray-100"
                                        : "text-gray-400"
                                    }`}
                            >
                                {format(day.date, "d")}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}