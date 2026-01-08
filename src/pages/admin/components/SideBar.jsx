import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutGrid,
    Calendar,
    Users,
    UserCircle,
} from "lucide-react";

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { id: 1, icon: LayoutGrid, label: "Dashboard", path: "/admin" },
        { id: 2, icon: UserCircle, label: "Tài khoản", path: "/admin/accounts" },
        { id: 3, icon: Users, label: "Nhân viên", path: "/admin/staff" },
        { id: 4, icon: Calendar, label: "Lịch làm việc", path: "/admin/work-schedule" },
    ];

    const isActive = (path) => {
        if (path === "/admin") return location.pathname === "/admin";
        return location.pathname.startsWith(path);
    };

    return (
        <aside className="flex flex-col items-center gap-2 py-4">
            {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                    <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={`w-14 h-14 flex flex-col items-center justify-center rounded-xl transition-all duration-200 ${
                            isActive(item.path)
                                ? "bg-blue-600 text-white shadow-lg"
                                : "text-slate-600 hover:bg-slate-100"
                        }`}
                        title={item.label}
                    >
                        <Icon className="w-6 h-6" />
                        <span className="text-[10px] mt-1">
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </aside>
    );
};

export default SideBar;
