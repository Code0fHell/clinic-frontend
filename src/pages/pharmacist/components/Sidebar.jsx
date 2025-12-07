import React from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutGrid,
    Pill,
    Calendar,
    ClipboardCheck,
} from "lucide-react";

export default function PharmacistSidebar() {
    const menuItems = [
        { icon: LayoutGrid, path: "/pharmacist/home", tooltip: "Trang chủ" },
        { icon: ClipboardCheck, path: "/pharmacist/prescriptions", tooltip: "Đơn thuốc" },
        { icon: Pill, path: "/pharmacist/medicines", tooltip: "Quản lý thuốc" },
        { icon: Calendar, path: "/pharmacist/schedule", tooltip: "Lịch làm việc" },
    ];

    return (
        <aside className="w-16 bg-white flex flex-col items-center py-6">
            {menuItems.map(({ icon: Icon, path, tooltip }, index) => (
                <NavLink
                    key={path}
                    to={path}
                    title={tooltip}
                    end={index === 0}
                    className={({ isActive }) =>
                        `w-12 h-12 flex items-center justify-center mt-6 rounded-2xl transition-all duration-200 ${isActive
                            ? "bg-[#00796B] text-white shadow-md"
                            : "text-[#3a3a5a] hover:text-[#009688]"
                        }`
                    }
                >
                    <Icon size={22} />
                </NavLink>
            ))}
        </aside>
    );
}

