import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-slate-200 bg-white">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-slate-800">
          Quản trị hệ thống
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-800">
            {user?.full_name || user?.username}
          </p>
          <p className="text-xs text-slate-500">
            {user?.user_role === "ADMIN" ? "Quản trị viên" : "Chủ sở hữu"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default Header;

