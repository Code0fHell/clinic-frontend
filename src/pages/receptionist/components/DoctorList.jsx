import React from "react";

export default function DoctorList() {
    const doctors = Array(10)
        .fill({
            name: "Dr. Susana Thompson",
            role: "Physician",
            img: "https://randomuser.me/api/portraits/women/44.jpg",
        });

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Bác sĩ trống lịch</h3>

            <div
                className="max-h-[306px] overflow-y-auto pr-2
                   [&::-webkit-scrollbar]:hidden
                   [-ms-overflow-style:none]
                   [scrollbar-width:none]"
            >
                {doctors.map((d, idx) => (
                    <div
                        key={idx}
                        className="flex items-center py-3 border-b border-gray-100 last:border-none hover:bg-gray-50 rounded-lg px-2 transition-colors"
                    >
                        <img
                            src={d.img}
                            alt={d.name}
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-[#008080]/20"
                        />
                        <div className="ml-4">
                            <p className="text-[15px] font-semibold text-gray-600">{d.name}</p>
                            <p className="text-sm text-gray-500">{d.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}
