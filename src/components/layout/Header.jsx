import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useNotifications from "../../hooks/useNotifications";
import NotificationDropdown from "../notifications/NotificationDropdown";

const Header = () => {
  const { user, logout } = useAuth();
  const { unreadCount, refresh } = useNotifications();

  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const avatarRef = useRef();
  const notificationRef = useRef();

  const handleLogout = () => {
    logout();
    navigate("/patient/login");
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
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <span className="text-2xl font-bold text-blue-600">PMED</span>
        <span className="text-2xl font-bold text-green-500">Clinic</span>
      </div>
      <nav className="flex-1 flex justify-center gap-12 text-lg font-medium text-gray-700">
        <Link to="/" className="hover:text-blue-600 transition">Trang chủ</Link>
        <Link to="/services" className="hover:text-blue-600 transition">Dịch vụ</Link>
        <Link to="/doctors" className="hover:text-blue-600 transition">Bác sĩ</Link>
        {isPatient ? (
          <>
            <Link to="/medicines" className="hover:text-blue-600 transition">Thuốc</Link>
            <Link to="/patient/appointments" className="hover:text-blue-600 transition">Lịch hẹn</Link>
          </>
        ) : (
          <>
            <Link to="/about" className="hover:text-blue-600 transition">Về PMed</Link>
            <Link to="/contact" className="hover:text-blue-600 transition">Liên hệ</Link>
          </>
        )}
      </nav>
      {user ? (
        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <div className="relative" ref={notificationRef}>
            <button
              className="relative p-2 text-gray-600 hover:text-blue-600 transition focus:outline-none"
              onClick={() => {
                setNotificationOpen((v) => !v);
                setDropdown(false);
              }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            <NotificationDropdown
              isOpen={notificationOpen}
              onClose={() => setNotificationOpen(false)}
              unreadCount={unreadCount}
              onMarkRead={refresh}
            />
          </div>

          {/* User Avatar Dropdown */}
          <div className="relative" ref={avatarRef}>
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => {
                setDropdown((v) => !v);
                setNotificationOpen(false);
              }}
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
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            to="/patient/login"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
          >
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Đăng ký
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;