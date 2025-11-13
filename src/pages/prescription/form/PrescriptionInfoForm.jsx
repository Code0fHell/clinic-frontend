import React from "react";

const PrescriptionInfoForm = ({ patient, conclusion, setConclusion, disabled }) => (
  <div className="bg-white rounded shadow p-4 grid grid-cols-2 gap-4">
    <div>
      <div><b>Họ và tên:</b> {patient.patient_full_name}</div>
      <div><b>Năm sinh:</b> {patient.patient_dob ? new Date(patient.patient_dob).getFullYear() : ""}</div>
      <div><b>Địa chỉ:</b> {patient.patient_address}</div>
    </div>
    <div>
      <label className="block font-semibold mb-1">Kết luận</label>
      <textarea
        className="w-full border rounded p-2"
        rows={3}
        value={conclusion}
        onChange={(e) => setConclusion(e.target.value)}
        placeholder="Nhập kết luận"
        disabled={disabled}
      />
    </div>
  </div>
);

export default PrescriptionInfoForm;