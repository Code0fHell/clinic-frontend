import React, { useState } from "react";

const appointments = [
    { time: "8:00 Sáng", name: "Nguyễn Trường Sơn", phone: "0912345678", status: "Đã hoàn thành", color: "bg-green-100 text-green-700" },
    { time: "9:00 Sáng", name: "Lê Gia Quang", phone: "0987654321", status: "Đang thực hiện", color: "bg-yellow-100 text-yellow-700" },
    { time: "10:00 Sáng", name: "Bùi Trường Sơn", phone: "0901122334", status: "Đang chờ", color: "bg-orange-100 text-orange-700" },
    { time: "11:00 Sáng", name: "Nguyễn Đức Hoàng", phone: "0911223344", status: "Đang chờ", color: "bg-orange-100 text-orange-700" },
    { time: "13:00 Chiều", name: "Nguyễn Minh Châu", phone: "0922334455", status: "Đang chờ", color: "bg-orange-100 text-orange-700" },
    { time: "14:00 Chiều", name: "Nguyễn Thanh Ngân", phone: "0933445566", status: "Đang chờ", color: "bg-orange-100 text-orange-700" },
    { time: "15:00 Chiều", name: "Nguyễn Nhật Quỳnh Hương", phone: "0944556677", status: "Đang chờ", color: "bg-orange-100 text-orange-700" },
    { time: "16:00 Chiều", name: "Trần Văn A", phone: "0955667788", status: "Đang chờ", color: "bg-orange-100 text-orange-700" },
    { time: "17:00 Chiều", name: "Lê Thị B", phone: "0966778899", status: "Đã hoàn thành", color: "bg-green-100 text-green-700" },
    { time: "18:00 Tối", name: "Phạm Văn C", phone: "0977889900", status: "Đang thực hiện", color: "bg-yellow-100 text-yellow-700" },
    { time: "19:00 Tối", name: "Hoàng Thị D", phone: "0988990011", status: "Đang chờ", color: "bg-orange-100 text-orange-700" },
];

const statuses = ["Tất cả", "Đang chờ", "Đang thực hiện", "Đã hoàn thành"];

export default function AppointmentList() {
    const [selectedStatus, setSelectedStatus] = useState("Đang chờ");

    const filteredAppointments =
        selectedStatus === "Tất cả"
            ? appointments
            : appointments.filter((apt) => apt.status === selectedStatus);

    return (
        <div className="bg-white rounded-2xl shadow-sm p-4 h-[490px] flex flex-col">
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-800">Lịch hẹn hôm nay</h3>
                {/* <a href="#" className="text-sm font-semibold text-teal-600 hover:underline">
                    Xem tất cả
                </a> */}
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 mb-4 flex-wrap">
                {statuses.map((status) => (
                    <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`hover:cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedStatus === status
                            ? "bg-teal-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Danh sách – 10 DÒNG, CUỘN KHI HOVER */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden hover:scrollbar-visible transition-all">
                <div className="space-y-4">
                    {filteredAppointments.map((apt, index) => (
                        <div
                            key={index}
                            className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors rounded-lg px-1 gap-3"
                        >
                            {/* CỘT TRÁI: Thời gian + Tên (xuống dòng nếu dài) */}
                            <div className="flex items-start space-x-4 flex-1 min-w-0">
                                {/* Thời gian: cố định + số điện thoại */}
                                <div className="min-w-32 flex-shrink-0">
                                    <div className="text-base font-semibold text-gray-600">{apt.time}</div>
                                    <div className="text-sm text-gray-500 italic mt-1">( SĐT: {apt.phone} )</div>
                                </div>

                                {/* Tên: XUỐNG DÒNG nếu dài */}
                                <div className="text-lg font-semibold text-gray-600 break-words line-clamp-2">
                                    {apt.name}
                                </div>
                            </div>

                            {/* Nút trạng thái: cố định bên phải */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${apt.color} shadow-sm`}>
                                    {apt.status}
                                </span>
                                {apt.status === "Đang chờ" && (
                                    <button className="px-4 py-1.5 rounded-full text-sm font-bold bg-red-100 text-red-700 shadow-sm hover:bg-red-200 transition-colors">
                                        Hủy
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}