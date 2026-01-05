import React, { useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useNotifications from "../../../hooks/useNotifications";
import NotificationDropdown from "../../../components/notifications/NotificationDropdown";

export default function PharmacistHeader() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { unreadCount, refresh } = useNotifications();
    const [notificationOpen, setNotificationOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleNotificationClick = () => {
        setNotificationOpen(!notificationOpen);
    };

    const handleMarkRead = () => {
        refresh();
    };

    return (
        <header className="flex items-center justify-between px-12 py-4 bg-white shadow">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/pharmacist/home")}>
                <span className="text-4xl font-bold text-blue-600">PMED</span>
                <span className="text-4xl font-bold text-green-600">Clinic</span>
            </div>
            
            {/* Right section */}
            <div className="flex items-center gap-5">
                {/* Notification Bell */}
                <div className="relative">
                    <button
                        onClick={handleNotificationClick}
                        className="relative p-2 text-gray-500 hover:text-[#008080] transition"
                    >
                        <Bell size={25} />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                    <NotificationDropdown
                        isOpen={notificationOpen}
                        onClose={() => setNotificationOpen(false)}
                        unreadCount={unreadCount}
                        onMarkRead={handleMarkRead}
                    />
                </div>

                {/* User Info / Logout Button */}
                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="text-gray-700 font-medium">
                            Xin chào, <span className="text-xl text-blue-600 font-bold">{user.full_name || user.username}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 cursor-pointer transition"
                        >
                            Đăng xuất
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Đăng nhập
                    </button>
                )}
            </div>
        </header>
    );
}


