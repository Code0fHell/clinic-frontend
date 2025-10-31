import React, { useState } from 'react';
import { login as loginApi } from '../../api/auth.api';
import useAuth from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginApi(form);
      const { user, token } = res.data;

      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      login(user, token);

      // Điều hướng theo vai trò
      switch (user.role) {
        case "PATIENT":
          navigate("/home");
          break;
        case "RECEPTIONIST":
          navigate("/receptionist/home");
          break;
        case "DOCTOR":
          navigate("/doctor/dashboard");
          break;
        case "OWNER":
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };


  return (
    <div className="flex min-h-screen bg-blue-600">
      <div className="flex flex-col items-center justify-center w-1/2 bg-blue-600 text-white">
        <img src="/logo.svg" alt="Logo" className="w-48 h-48 rounded-full mb-6" />
        <h1 className="text-3xl font-bold">PMedClinic</h1>
      </div>
      <div className="flex flex-col justify-center w-1/2 bg-white rounded-l-3xl px-16">
        <h2 className="text-2xl font-bold mb-2">Đăng nhập</h2>
        <p className="mb-6 text-gray-500">Đăng nhập để trải nghiệm thêm các dịch vụ của phòng khám</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Tên đăng nhập</label>
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
            <label className="block mb-1 font-medium">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <div className="flex justify-between items-center">
            <Link to="/forgot-password" className="text-blue-600 hover:underline text-sm">Quên mật khẩu?</Link>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
          >
            Đăng nhập
          </button>
        </form>
        <div className="mt-6 text-center">
          <span>Chưa có tài khoản?</span>
          <Link to="/register" className="ml-2 px-4 py-2 border rounded text-blue-600 hover:bg-blue-50">Đăng ký</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;