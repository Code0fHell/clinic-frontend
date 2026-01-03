import React, { useState, useEffect } from "react";
import { Button } from "./ui";

const EditStaffModal = ({ staff, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    license_number: "",
    doctor_type: "",
    is_available: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (staff) {
      setFormData({
        full_name: staff.user?.full_name || "",
        email: staff.user?.email || "",
        phone: staff.user?.phone || "",
        department: staff.department || "",
        position: staff.position || "",
        license_number: staff.license_number || "",
        doctor_type: staff.doctor_type || "",
        is_available: staff.is_available ?? true,
      });
    }
  }, [staff]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Loại bỏ các field rỗng
      const submitData = { ...formData };
      Object.keys(submitData).forEach((key) => {
        if (submitData[key] === "" || submitData[key] === null) {
          delete submitData[key];
        }
      });

      await onSubmit(submitData);
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const isDoctor = staff?.user?.user_role === "DOCTOR";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">Cập nhật thông tin nhân viên</h2>
          <p className="text-sm text-slate-600 mt-1">
            {staff?.user?.username} - {staff?.user?.user_role}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
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
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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

          {isDoctor && (
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_available"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_available" className="text-sm font-medium text-slate-700">
                  Đang hoạt động
                </label>
              </div>
            </>
          )}

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

export default EditStaffModal;

