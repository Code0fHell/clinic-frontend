import React, { useState, useEffect } from "react";
import { Button } from "./ui";

const EditUserModal = ({ user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    user_role: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        user_role: user.user_role || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Xóa lỗi của field đang được chỉnh sửa
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Validate email format
  const validateEmail = (email) => {
    if (!email) return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone format (10-11 digits only)
  const validatePhone = (phone) => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // Validate email format
      if (formData.email && !validateEmail(formData.email)) {
        setErrors({ email: "Email không đúng định dạng!" });
        setLoading(false);
        return;
      }

      // Validate phone format
      if (formData.phone && !validatePhone(formData.phone)) {
        setErrors({ phone: "Số điện thoại phải là 10-11 chữ số, không được chứa chữ cái hoặc ký tự đặc biệt!" });
        setLoading(false);
        return;
      }

      // Loại bỏ các field rỗng hoặc không thay đổi
      const submitData = {};
      if (formData.full_name && formData.full_name !== user.full_name) {
        submitData.full_name = formData.full_name;
      }
      if (formData.email && formData.email !== user.email) {
        submitData.email = formData.email;
      }
      if (formData.phone && formData.phone !== user.phone) {
        submitData.phone = formData.phone;
      }
      if (formData.user_role && formData.user_role !== user.user_role) {
        submitData.user_role = formData.user_role;
      }

      // Nếu không có gì thay đổi
      if (Object.keys(submitData).length === 0) {
        setErrors({ general: "Không có thay đổi nào để cập nhật!" });
        setLoading(false);
        return;
      }

      await onSubmit(submitData);
    } catch (err) {
      console.error("Error updating user:", err);
      const errorResponse = err.response?.data;
      const newErrors = {};

      if (errorResponse?.message) {
        const message = errorResponse.message;

        if (Array.isArray(message)) {
          // Backend trả về mảng lỗi validation
          message.forEach((msg) => {
            const lowerMsg = msg.toLowerCase();

            if (lowerMsg.includes("email")) {
              newErrors.email = msg;
            } else if (lowerMsg.includes("full_name") || lowerMsg.includes("họ") || lowerMsg.includes("tên")) {
              newErrors.full_name = msg;
            } else if (lowerMsg.includes("phone") || lowerMsg.includes("điện thoại")) {
              newErrors.phone = msg;
            } else if (lowerMsg.includes("role") || lowerMsg.includes("vai trò")) {
              newErrors.user_role = msg;
            } else {
              if (!newErrors.general) newErrors.general = msg;
              else newErrors.general += "; " + msg;
            }
          });
        } else if (typeof message === "string") {
          const lowerMsg = message.toLowerCase();

          // Xử lý lỗi duplicate key
          if (lowerMsg.includes("duplicate") || lowerMsg.includes("trùng") || lowerMsg.includes("tồn tại")) {
            if (lowerMsg.includes("email")) {
              newErrors.email = "Email đã tồn tại trong hệ thống";
            } else {
              newErrors.general = message;
            }
          } else if (lowerMsg.includes("email")) {
            newErrors.email = message;
          } else if (lowerMsg.includes("phone") || lowerMsg.includes("điện thoại")) {
            newErrors.phone = message;
          } else if (lowerMsg.includes("full_name") || lowerMsg.includes("họ") || lowerMsg.includes("tên")) {
            newErrors.full_name = message;
          } else if (lowerMsg.includes("role") || lowerMsg.includes("vai trò")) {
            newErrors.user_role = message;
          } else {
            newErrors.general = message;
          }
        }
      } else {
        newErrors.general = "Có lỗi xảy ra khi cập nhật thông tin!";
      }

      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">Cập nhật thông tin tài khoản</h2>
          <p className="text-sm text-slate-600 mt-1">
            {user?.username}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.general}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.full_name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:ring-blue-500"
              }`}
            />
            {errors.full_name && (
              <p className="text-xs text-red-600 mt-1">{errors.full_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 placeholder:text-slate-400 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:ring-blue-500"
              }`}
            />
            {errors.email ? (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            ) : (
              <p className="text-xs text-slate-500 mt-1">
                Nhập email đúng định dạng (VD: user@example.com)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0912345678"
              pattern="[0-9]*"
              inputMode="numeric"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 placeholder:text-slate-400 ${
                errors.phone
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:ring-blue-500"
              }`}
            />
            {errors.phone ? (
              <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
            ) : (
              <p className="text-xs text-slate-500 mt-1">
                Chỉ nhập số, 10-11 chữ số (VD: 0912345678)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Vai trò <span className="text-red-500">*</span>
            </label>
            <select
              name="user_role"
              value={formData.user_role}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.user_role
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:ring-blue-500"
              }`}
            >
              <option value="PATIENT">Bệnh nhân</option>
              <option value="RECEPTIONIST">Lễ tân</option>
              <option value="PHARMACIST">Dược sĩ</option>
              <option value="DOCTOR">Bác sĩ</option>
              <option value="ADMIN">Admin</option>
              <option value="OWNER">Owner</option>
            </select>
            {errors.user_role && (
              <p className="text-xs text-red-600 mt-1">{errors.user_role}</p>
            )}
            <p className="text-xs text-amber-600 mt-1">
              ⚠️ Thay đổi vai trò có thể ảnh hưởng đến quyền truy cập của người dùng
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="secondary" className="flex-1">
              Hủy
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;

