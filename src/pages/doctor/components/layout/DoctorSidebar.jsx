import React from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutGrid,
    Calendar,
    Users,
    FileText,
    ClipboardCheck,
} from "lucide-react";

export default function DoctorSidebar() {
    const menuItems = [
        { icon: LayoutGrid, path: "/doctor/dashboard", label: "Tổng quan" },
        { icon: Calendar, path: "/doctor/appointment", label: "Lịch hẹn" },
        { icon: Users, path: "/doctor/visit", label: "Bệnh nhân" },
        { icon: FileText, path: "/doctor/documents", label: "Hồ sơ" },
        { icon: ClipboardCheck, path: "/doctor/checklist", label: "Checklist" },
    ];

    return (
        <aside className="w-16 bg-white flex flex-col items-center py-6 shadow-sm border-r relative">
            {menuItems.map(({ icon: Icon, path, label }, index) => (
                <div key={path} className="relative mt-6 group flex justify-center w-full">
                    <NavLink
                        to={path}
                        end={index === 0}
                        className={({ isActive }) =>
                            `w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-200 ${
                                isActive
                                    ? "bg-[#00796B] text-white shadow-md"
                                    : "text-[#3a3a5a] hover:text-[#009688]"
                            }`
                        }
                    >
                        <Icon size={22} />
                    </NavLink>

                    {/* Tooltip động */}
                    <div
                        className="
                            absolute left-14 top-1/2 -translate-y-1/2
                            bg-gray-800 text-white text-xs py-1 px-3 rounded-lg 
                            opacity-0 pointer-events-none 
                            group-hover:opacity-100 group-hover:translate-x-1
                            transition-all duration-200 whitespace-nowrap shadow-md
                        "
                    >
                        {label}
                    </div>
                </div>
            ))}
        </aside>
    );
}
