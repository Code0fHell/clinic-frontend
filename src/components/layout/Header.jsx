import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; 

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-12 py-4 bg-white shadow">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <span className="text-2xl font-bold text-blue-600">PMED</span>
        <span className="text-2xl font-bold text-green-500">Clinic</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex justify-center gap-12 text-lg font-medium text-gray-700">
        <Link to="/home" className="hover:text-blue-600 transition">Trang chủ</Link>
        <Link to="/services" className="hover:text-blue-600 transition">Dịch vụ</Link>
        <Link to="/doctors" className="hover:text-blue-600 transition">Bác sĩ</Link>
        <Link to="/about" className="hover:text-blue-600 transition">Về PMed</Link>
        <Link to="/contact" className="hover:text-blue-600 transition">Liên hệ</Link>
      </nav>

      {/* User Info / Login Button */}
      {user ? (
        <div className="flex items-center gap-4">
          <div className="text-gray-700 font-medium">
            👋 Xin chào, <span className="text-blue-600 font-semibold">{user.full_name || user.username}</span>
          </div>
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
    </header>
  );
};

export default Header;
