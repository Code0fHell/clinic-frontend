import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState(false);
  const avatarRef = useRef();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClick = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) setDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isPatient = user?.role === "PATIENT";
   const avatarUrl = user?.avatar
    ? `http://localhost:3000${user.avatar}`
    : `https://ui-avatars.com/api/?name=${user?.full_name || user?.username}`;
  return (
    <header className="flex items-center justify-between px-12 py-4 bg-white shadow">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/patient/home")}>
        <span className="text-2xl font-bold text-blue-600">PMED</span>
        <span className="text-2xl font-bold text-green-500">Clinic</span>
      </div>
      <nav className="flex-1 flex justify-center gap-12 text-lg font-medium text-gray-700">
        <Link to="/patient/home" className="hover:text-blue-600 transition">Trang chủ</Link>
        <Link to="/services" className="hover:text-blue-600 transition">Dịch vụ</Link>
        <Link to="/doctors" className="hover:text-blue-600 transition">Bác sĩ</Link>
        {isPatient ? (
          <>
            <Link to="/medicines" className="hover:text-blue-600 transition">Thuốc</Link>
            <Link to="/appointments" className="hover:text-blue-600 transition">Lịch hẹn</Link>
          </>
        ) : (
          <>
            <Link to="/about" className="hover:text-blue-600 transition">Về PMed</Link>
            <Link to="/contact" className="hover:text-blue-600 transition">Liên hệ</Link>
          </>
        )}
      </nav>
      {user ? (
        <div className="relative" ref={avatarRef}>
          <button
            className="flex items-center gap-2 focus:outline-none"
            onClick={() => setDropdown((v) => !v)}
          >
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-10 h-10 rounded-full border object-cover"
            />
            <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
              <path d="M5 8l5 5 5-5" stroke="#555" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          {dropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => { setDropdown(false); navigate("/profile"); }}
              >
                Xem thông tin cá nhân
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          )}
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