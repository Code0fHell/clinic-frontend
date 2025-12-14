import React from "react";
import { Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";


export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="flex items-center  justify-between px-12 py-4 bg-white shadow">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                <span className="text-4xl font-bold text-blue-600">PMED</span>
                <span className="text-4xl font-bold text-green-600">Clinic</span>
            </div>
            {/* Right section */}
            <div className="flex items-center gap-5">
                {/* <Bell className="text-gray-500 cursor-pointer hover:text-[#2254d3]" size={25} /> */}
                {/* <img
                    src="https://i.pravatar.cc/40"
                    alt="User avatar"
                    className="w-10 h-10 rounded-full border border-gray-300"
                /> */}
                {/* User Info / Login Button */}
                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="text-gray-700 font-medium">
                            👋 Xin chào, <span className="text-xl text-blue-600 font-bold">{user.full_name || user.username}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 cursor-pointer transition"
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
}

