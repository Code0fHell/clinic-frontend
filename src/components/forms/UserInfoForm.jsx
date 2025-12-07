import React, { useState, useEffect } from "react";

const UserInfoForm = ({ user, onSubmit }) => {
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setEditMode(false);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Thông tin tài khoản</h2>
        {editMode ? (
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Lưu
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>✏️</span> Chỉnh sửa thông tin
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-500">Họ và tên</label>
          {editMode ? (
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="p-2 border rounded w-full text-sm bg-white"
            />
          ) : (
            <div className="text-base">{form.full_name}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-500">Email</label>
          {editMode ? (
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="p-2 border rounded w-full text-sm bg-white"
            />
          ) : (
            <div className="text-base">{form.email}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-500">Số điện thoại</label>
          {editMode ? (
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="p-2 border rounded w-full text-sm bg-white"
            />
          ) : (
            <div className="text-base">{form.phone}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoForm;