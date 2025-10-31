import React from "react";

const appointments = [
    { time: "8:00 Sáng", name: "Nguyễn Trường Sơn", status: "Đã hoàn thành", color: "bg-green-100 text-green-700" },
    { time: "9:00 Sáng", name: "Lê Gia Quang", status: "Đang thực hiện", color: "bg-yellow-100 text-yellow-700" },
    { time: "10:00 Sáng", name: "Bùi Trường Sơn", status: "Đang chờ", color: "bg-orange-100 text-orange-700" },
    { time: "11:00 Sáng", name: "Nguyễn Đức Hoàng", status: "Đang chờ", color: "bg-orange-100 text-orange-700" },
    { time: "13:00 Chiều", name: "Nguyễn Minh Châu", status: "Đang chờ", color: "bg-orange-100 text-orange-700" },
    { time: "14:00 Chiều", name: "Nguyễn Thanh Ngân", status: "Đang chờ", color: "bg-orange-100 text-orange-700" },
    { time: "15:00 Chiều", name: "Nguyễn Nhật Quỳnh Hương", status: "Đang chờ", color: "bg-orange-100 text-orange-700" },
    { time: "16:00 Chiều", name: "Trần Văn A", status: "Đang chờ", color: "bg-orange-100 text-orange-700" },
    { time: "17:00 Chiều", name: "Lê Thị B", status: "Đã hoàn thành", color: "bg-green-100 text-green-700" },
    { time: "18:00 Tối", name: "Phạm Văn C", status: "Đang thực hiện", color: "bg-yellow-100 text-yellow-700" },
    { time: "19:00 Tối", name: "Hoàng Thị D", status: "Đang chờ", color: "bg-orange-100 text-orange-700" },
];

export default function AppointmentList() {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-2xl font-bold text-gray-800">Lịch hẹn hôm nay</h3>
                <a href="#" className="text-sm font-semibold text-teal-600 hover:underline">
                    Xem tất cả
                </a>
            </div>

            {/* Danh sách – 10 DÒNG, CUỘN KHI HOVER */}
            <div className="flex-1 max-h-[460px] overflow-y-auto scrollbar-hidden hover:scrollbar-visible transition-all">
                <div className="space-y-4">
                    {appointments.map((apt, index) => (
                        <div
                            key={index}
                            className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors rounded-lg px-1 gap-3"
                        >
                            {/* CỘT TRÁI: Thời gian + Tên (xuống dòng nếu dài) */}
                            <div className="flex items-start space-x-4 flex-1 min-w-0">
                                {/* Thời gian: cố định */}
                                <div className="text-base font-semibold text-gray-600 min-w-32 flex-shrink-0">
                                    {apt.time}
                                </div>

                                {/* Tên: XUỐNG DÒNG nếu dài */}
                                <div className="text-lg font-semibold text-gray-600 break-words line-clamp-2">
                                    {apt.name}
                                </div>
                            </div>

                            {/* Nút trạng thái: cố định bên phải */}
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${apt.color} shadow-sm flex-shrink-0`}>
                                {apt.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}