import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/admin" },
    { id: "accounts", label: "Tài khoản", icon: "👥", path: "/admin/accounts" },
    { id: "staff", label: "Nhân viên", icon: "👔", path: "/admin/staff" },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="flex flex-col items-center gap-2 py-4">
      {menuItems.map((item) => (
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
          <span className="text-2xl">{item.icon}</span>
          <span className="text-[10px] mt-1">{item.label}</span>
        </button>
      ))}
    </aside>
  );
};

export default SideBar;

