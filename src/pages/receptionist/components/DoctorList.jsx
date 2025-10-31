import React from "react";

export default function DoctorList() {
    const doctors = Array(10)
        .fill({
            name: "Dr. Susana Thompson",
            role: "Physician",
            img: "https://randomuser.me/api/portraits/women/44.jpg",
        });

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            {/* Tiêu đề */}
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Bác sĩ trống lịch{" "}
                {/* <span className="text-gray-500 text-sm font-normal">
                    (sẵn sàng tiếp nhận bệnh nhân)
                </span> */}
            </h3>

            {/* Danh sách bác sĩ */}
            <div
                className="max-h-[300px] overflow-y-auto pr-2
                           [&::-webkit-scrollbar]:hidden
                           [-ms-overflow-style:none]
                           [scrollbar-width:none]"
            >
                {doctors.map((d, idx) => (
                    <div
                        key={idx}
                        className="flex items-center py-2 border-b border-gray-100 last:border-none hover:bg-gray-50 rounded-lg px-2 transition-colors"
                    >
                        <img
                            src={d.img}
                            alt={d.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#008080]/20"
                        />
                        <div className="ml-4">
                            <p className="text-lg font-semibold text-gray-600">{d.name}</p>
                            <p className="text-sm text-gray-500">{d.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
