import React, { useState, useEffect } from "react";

const PatientInfoForm = ({ patient, onSubmit }) => {
  const [editMode, setEditMode] = useState(false);
  
  const [form, setForm] = useState({
    patient_dob: "",
    patient_gender: "",
    blood_type: "",
    height: "",
    patient_address: "",
    weight: ""
  });

  useEffect(() => {
    if (patient) {
      setForm({
        patient_dob: patient.patient_dob ? patient.patient_dob.substring(0, 10) 
        : "",
        patient_gender: patient.patient_gender || "",
        blood_type: patient.blood_type || "",
        height: patient.height || "",
        patient_address: patient.patient_address || "",
        weight: patient.weight || "",
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSubmit(form);
    setEditMode(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const genderDisplay = form.patient_gender === "NAM" ? "Nam" : form.gender === "NU" ? "Nữ" : "";

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Thông tin bệnh án</h2>
        {editMode ? (
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
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
          <label className="block text-sm font-medium mb-1 text-gray-500">Ngày sinh</label>
          {editMode ? (
            <input
              type="date"
              name="patient_dob"
              value={form.patient_dob}
              onChange={handleChange}
              className="p-2 border rounded w-full text-sm bg-white"
            />
          ) : (
            <div className="text-base">{formatDate(form.patient_dob)}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-500">Giới tính</label>
          {editMode ? (
            <select
              name="patient_gender"
              value={form.patient_gender}
              onChange={handleChange}
              className="p-2 border rounded w-full text-sm bg-white"
            >
              <option value="">-- Chọn --</option>
              <option value="NAM">Nam</option>
              <option value="NU">Nữ</option>
            </select>
          ) : (
            <div className="text-base">{genderDisplay}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-500">Nhóm máu</label>
          {editMode ? (
            <input
              name="blood_type"
              value={form.blood_type}
              onChange={handleChange}
              className="p-2 border rounded w-full text-sm bg-white"
            />
          ) : (
            <div className="text-base">{form.blood_type}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-500">Chiều cao</label>
          {editMode ? (
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={handleChange}
              className="p-2 border rounded w-full text-sm bg-white"
            />
          ) : (
            <div className="text-base">{form.height} cm</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-500">Cân nặng</label>
          {editMode ? (
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              className="p-2 border rounded w-full text-sm bg-white"
            />
          ) : (
            <div className="text-base">{form.weight} kg</div>
          )}
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium mb-1 text-gray-500">Địa chỉ</label>
          {editMode ? (
            <input
              name="patient_address"
              value={form.patient_address}
              onChange={handleChange}
              className="p-2 border rounded w-full text-sm bg-white"
            />
          ) : (
            <div className="text-base">{form.patient_address}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientInfoForm;