import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";

const DoctorHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex sticky items-center justify-between px-12 py-4 bg-white shadow h-[80px] fixed top-0 left-0 right-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/doctor/dashboard")}>
        <span className="text-2xl font-bold text-blue-600">PMED</span>
        <span className="text-2xl font-bold text-green-500">Clinic</span>
      </div>

      {/* Right: Notification + Avatar */}
      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="text-gray-700 font-medium">
              👋 Xin chào, <span className="text-blue-600 font-semibold">{user.full_name || user.username}</span>
            </div>
            <img src={`http://localhost:3000${user.avatar}`}
              alt="Doctor Avatar"
              className="w-10 h-10 rounded-full border object-cover"
            />
            <button
              onClick={handleLogout}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
};

export default DoctorHeader;