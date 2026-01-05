import React, { useState } from "react";
import { register as registerApi } from "../../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import DatePicker from "../../components/forms/DatePicker";
import Toast from "../../components/modals/Toast";

const RegisterPage = () => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        email: "",
        full_name: "",
        date_of_birth: "",
        gender: "",
        phone: "",
        address: "",
    });
    const [toast, setToast] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm({ ...form, [name]: type === "radio" ? value : value });
        setError("");
    };

    const handleDateChange = (date) => {
        setForm({ ...form, date_of_birth: date });
    };

    // Hàm validate dữ liệu đầu vào
    const validateForm = () => {
        if (!form.username.trim()) return "Tên đăng nhập không được để trống";
        if (form.username.length < 6) return "Tên đăng nhập phải có ít nhất 6 ký tự";
        if (!form.password.trim()) return "Mật khẩu không được để trống";
        if (form.password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
        if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/\d/.test(form.password)) {
            return "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số";
        }
        if (!form.email.trim()) return "Email không được để trống";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Email không hợp lệ";
        if (!form.full_name.trim()) return "Họ và tên không được để trống";
        if (!form.gender) return "Vui lòng chọn giới tính";
        if (!form.date_of_birth) return "Vui lòng chọn ngày sinh";
        if (!form.phone.trim()) return "Số điện thoại không được để trống";
        if (!/^(0|\+84)(\d{9,10})$/.test(form.phone)) return "Số điện thoại không hợp lệ";
        if (!form.address.trim()) return "Địa chỉ không được để trống";
        return null;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }
        try {
            await registerApi(form);
            setToast({ message: "Đăng ký thành công! Vui lòng đăng nhập.", type: "success" });
            setTimeout(() => navigate("/patient/login"), 2000);
        } catch (err) {
            const msg = err.response?.data?.message;
            if (Array.isArray(msg)) setError(msg.join(", "));
            else setError(msg || "Đăng ký thất bại. Vui lòng thử lại!");
        }
    };

    return (
        <div className="flex min-h-screen bg-blue-600">
            {toast && ( <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} duration={2000} /> )}
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
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring placeholder:text-gray-400"
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
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring placeholder:text-gray-400"
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
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring placeholder:text-gray-400"
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
                            name="full_name"
                            value={form.full_name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring placeholder:text-gray-400"
                            placeholder="Nhập họ và tên"
                            required
                        />
                    </div>
                    <div className="flex gap-6 items-start">
                        {/* Ngày sinh */}
                        <div className="flex-[0.6]">
                            <label className="block mb-1 font-medium">Ngày tháng năm sinh</label>
                            <DatePicker
                            value={form.date_of_birth}
                            onChange={handleDateChange}
                            placeholder="dd/mm/yyyy"
                            className="w-full placeholder:text-gray-400"
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
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring placeholder:text-gray-400"
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
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring placeholder:text-gray-400"
                            placeholder="Nhập địa chỉ"
                            required
                        />
                    </div>
                    {error && <div className="text-red-500">{error}</div>}
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
                        to="/patient/login"
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
