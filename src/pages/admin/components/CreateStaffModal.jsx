import React, { useState } from "react";
import { Button } from "./ui";

const CreateStaffModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    full_name: "",
    phone: "",
    user_role: "RECEPTIONIST",
    department: "",
    position: "",
    license_number: "",
    doctor_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Xóa lỗi của field đang được chỉnh sửa
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Reset doctor_type nếu không phải role DOCTOR
    if (name === "user_role" && value !== "DOCTOR") {
      setFormData((prev) => ({ ...prev, doctor_type: "" }));
    }
  };

  // Validate email format
  const validateEmail = (email) => {
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
      if (!validateEmail(formData.email)) {
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
      // Loại bỏ các field rỗng
      const submitData = { ...formData };
      if (!submitData.doctor_type) delete submitData.doctor_type;
      if (!submitData.license_number) delete submitData.license_number;
      if (!submitData.department) delete submitData.department;
      if (!submitData.position) delete submitData.position;
      if (!submitData.phone) delete submitData.phone;

      await onSubmit(submitData);
    } catch (err) {
      console.error("Error creating staff - Full error:", err);
      console.error("Error response data:", err.response?.data);
      
      const errorResponse = err.response?.data;
      const newErrors = {};
      
      if (errorResponse?.message) {
        const message = errorResponse.message;
        console.log("Processing error message:", message, "Type:", typeof message);
        
        if (Array.isArray(message)) {
          // Backend trả về mảng lỗi validation (từ class-validator)
          message.forEach((msg) => {
            const lowerMsg = msg.toLowerCase();
            
            // Map lỗi vào đúng field
            if (lowerMsg.includes("email")) {
              newErrors.email = msg;
            } else if (lowerMsg.includes("username") || lowerMsg.includes("tên đăng nhập")) {
              newErrors.username = msg;
            } else if (lowerMsg.includes("password") || lowerMsg.includes("mật khẩu")) {
              newErrors.password = msg;
            } else if (lowerMsg.includes("full_name") || lowerMsg.includes("họ") || lowerMsg.includes("tên")) {
              newErrors.full_name = msg;
            } else if (lowerMsg.includes("phone") || lowerMsg.includes("điện thoại") || lowerMsg.includes("số điện thoại")) {
              newErrors.phone = msg;
            } else if (lowerMsg.includes("license") || lowerMsg.includes("giấy phép")) {
              newErrors.license_number = msg;
            } else if (lowerMsg.includes("department") || lowerMsg.includes("khoa") || lowerMsg.includes("phòng ban")) {
              newErrors.department = msg;
            } else if (lowerMsg.includes("position") || lowerMsg.includes("chức vụ")) {
              newErrors.position = msg;
            } else if (lowerMsg.includes("role") || lowerMsg.includes("vai trò")) {
              newErrors.user_role = msg;
            } else {
              // Lỗi chung
              if (!newErrors.general) newErrors.general = msg;
              else newErrors.general += "; " + msg;
            }
          });
        } else if (typeof message === "string") {
          // Backend trả về string lỗi (database error hoặc custom error)
          const lowerMsg = message.toLowerCase();
          
          // Xử lý lỗi duplicate key từ database
          if (lowerMsg.includes("duplicate") || lowerMsg.includes("trùng") || lowerMsg.includes("tồn tại")) {
            if (lowerMsg.includes("email")) {
              newErrors.email = "Email đã tồn tại trong hệ thống";
            } else if (lowerMsg.includes("username")) {
              newErrors.username = "Tên đăng nhập đã tồn tại trong hệ thống";
            } else {
              newErrors.general = message;
            }
          } 
          // Xử lý các lỗi validation khác
          else if (lowerMsg.includes("email")) {
            newErrors.email = message;
          } else if (lowerMsg.includes("username") || lowerMsg.includes("tên đăng nhập")) {
            newErrors.username = message;
          } else if (lowerMsg.includes("password") || lowerMsg.includes("mật khẩu")) {
            newErrors.password = message;
          } else if (lowerMsg.includes("full_name") || lowerMsg.includes("họ") || lowerMsg.includes("tên")) {
            newErrors.full_name = message;
          } else if (lowerMsg.includes("phone") || lowerMsg.includes("điện thoại") || lowerMsg.includes("số điện thoại")) {
            newErrors.phone = message;
          } else if (lowerMsg.includes("license") || lowerMsg.includes("giấy phép")) {
            newErrors.license_number = message;
          } else if (lowerMsg.includes("department") || lowerMsg.includes("khoa") || lowerMsg.includes("phòng ban")) {
            newErrors.department = message;
          } else if (lowerMsg.includes("position") || lowerMsg.includes("chức vụ")) {
            newErrors.position = message;
          } else if (lowerMsg.includes("role") || lowerMsg.includes("vai trò")) {
            newErrors.user_role = message;
          } else {
            newErrors.general = message;
          }
        }
      } 
      // Xử lý lỗi từ statusText hoặc lỗi không có message
      else if (err.response?.statusText) {
        newErrors.general = err.response.statusText;
      } else {
        newErrors.general = "Có lỗi xảy ra khi thêm nhân viên!";
      }
      
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">Thêm nhân viên mới</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.general}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.username 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-slate-300 focus:ring-blue-500"
                }`}
              />
              {errors.username && (
                <p className="text-xs text-red-600 mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-slate-300 focus:ring-blue-500"
                }`}
              />
              {errors.password ? (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              ) : (
                <p className="text-xs text-slate-500 mt-1">
                  Ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
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
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="RECEPTIONIST">Lễ tân</option>
              <option value="PHARMACIST">Dược sĩ</option>
              <option value="DOCTOR">Bác sĩ</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Khoa/Phòng ban
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Chức vụ
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {formData.user_role === "DOCTOR" && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Số giấy phép hành nghề
                </label>
                <input
                  type="text"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.license_number 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-slate-300 focus:ring-blue-500"
                  }`}
                />
                {errors.license_number && (
                  <p className="text-xs text-red-600 mt-1">{errors.license_number}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Loại bác sĩ
                </label>
                <select
                  name="doctor_type"
                  value={formData.doctor_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn loại --</option>
                  <option value="CLINICAL">Lâm sàng</option>
                  <option value="DIAGNOSTIC">Chẩn đoán</option>
                  <option value="TEST">Xét nghiệm</option>
                </select>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onClose} variant="secondary" className="flex-1">
              Hủy
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Đang thêm..." : "Thêm nhân viên"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStaffModal;

