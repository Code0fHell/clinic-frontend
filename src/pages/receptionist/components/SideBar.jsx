import React from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutGrid,
    Calendar,
    Users,
    FileText,
    ClipboardCheck,
} from "lucide-react";

export default function Sidebar() {
    const menuItems = [
        { icon: LayoutGrid, path: "/receptionist/home", tooltip: "Trang chủ" },
        { icon: Calendar, path: "/receptionist/appointment", tooltip: "Lịch hẹn" },
        { icon: Users, path: "/receptionist/patient", tooltip: "Bệnh nhân" },
        { icon: FileText, path: "/receptionist/invoice", tooltip: "Hóa đơn" },
        { icon: ClipboardCheck, path: "/receptionist/task", tooltip: "Công việc" },
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
