import React from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutGrid,
    CalendarDays,
    Pill
} from "lucide-react";

export default function SideBar() {
    const menuItems = [
        { icon: LayoutGrid, path: "/owner/dashboard", tooltip: "Trang chủ" },
        { icon: CalendarDays, path: "/owner/manage-schedule-staff", tooltip: "Quản lý lịch làm việc" },
        { icon: Pill, path: "/owner/medicine-inventory", tooltip: "Quản lý tồn kho thuốc" },
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
                            ? "bg-[#00796B] text-white shadow-md" // màu active như hình
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
