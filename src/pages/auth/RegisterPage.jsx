import React, { useState } from "react";
import { register as registerApi } from "../../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import DatePicker from "../../components/forms/DatePicker";

const RegisterPage = () => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        email: "",
        fullName: "",
        dob: "",
        gender: "",
        phone: "",
        address: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm({ ...form, [name]: type === "radio" ? value : value });
        setError("");
        setSuccess("");
    };

    const handleDateChange = (date) => {
        setForm({ ...form, dob: date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerApi(form);
            setSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Đăng ký thất bại");
        }
    };

    return (
        <div className="flex min-h-screen bg-blue-600">
            <div className="flex flex-col items-center justify-center w-1/2 bg-blue-600 text-white">
                <img
                    src="/logo.svg"
                    alt="Logo"
                    className="w-48 h-48 rounded-full mb-6"
                />
                <h1 className="text-3xl font-bold">PMedClinic</h1>
            </div>
            <div className="flex flex-col justify-center w-1/2 bg-white rounded-l-3xl px-16">
                <h2 className="text-2xl font-bold mb-2">Đăng ký</h2>
                <p className="mb-6 text-gray-500">
                    Tạo tài khoản mới với PMedClinic
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">
                            Tên đăng nhập
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
                            placeholder="Nhập tên đăng nhập"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
                            placeholder="Nhập mật khẩu mới"
                            required
                        />
                        <span className="text-xs text-gray-400">
                            Sử dụng ít nhất 8 kí tự để đảm bảo bảo an toàn
                        </span>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
                            placeholder="Nhập họ và tên"
                            required
                        />
                    </div>
                    <div className="flex gap-6 items-start">
                        {/* Ngày sinh */}
                        <div className="flex-[0.6]">
                            <label className="block mb-1 font-medium">Ngày tháng năm sinh</label>
                            <DatePicker
                            value={form.dob}
                            onChange={handleDateChange}
                            placeholder="dd/mm/yyyy"
                            className="w-full"
                            />
                        </div>

                        {/* Giới tính */}
                        <div className="flex flex-col flex-[0.4]">
                            <label className="block mb-1 font-medium">Giới tính</label>
                            <div className="flex items-center gap-6 mt-3">
                                <label className="flex items-center">
                                    <input
                                    type="radio"
                                    name="gender"
                                    value="NAM"
                                    checked={form.gender === "NAM"}
                                    onChange={handleChange}
                                    className="mr-2"
                                    />
                                    Nam
                                </label>
                                <label className="flex items-center">
                                    <input
                                    type="radio"
                                    name="gender"
                                    value="NU"
                                    checked={form.gender === "NU"}
                                    onChange={handleChange}
                                    className="mr-2"
                                    />
                                    Nữ
                                </label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">
                            Số điện thoại
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
                            placeholder="Nhập số điện thoại"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">
                            Địa chỉ
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
                            placeholder="Nhập địa chỉ"
                            required
                        />
                    </div>
                    {error && <div className="text-red-500">{error}</div>}
                    {success && <div className="text-green-500">{success}</div>}
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                    >
                        Đăng ký
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <span>Đã có tài khoản?</span>
                    <Link
                        to="/login"
                        className="ml-2 px-4 py-2 border rounded text-blue-600 hover:bg-blue-50"
                    >
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
