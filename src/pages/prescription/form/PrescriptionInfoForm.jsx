import React from "react";
import dayjs from "dayjs";

const PrescriptionInfoForm = ({ patient, conclusion, setConclusion, disabled }) => (
  <div className="space-y-4">
    {/* Patient Info */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
      <div className="flex flex-col">
        <span className="text-emerald-100 text-xs font-medium mb-1">Họ và tên</span>
        <span className="font-semibold text-base">{patient.patient_full_name || "—"}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-emerald-100 text-xs font-medium mb-1">Giới tính</span>
        <span className="font-semibold text-base">{patient.patient_gender === "NAM" ? "Nam" : "Nữ"}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-emerald-100 text-xs font-medium mb-1">Năm sinh</span>
        <span className="font-semibold text-base">{patient.patient_dob ? dayjs(patient.patient_dob).format("DD/MM/YYYY") : "—"}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-emerald-100 text-xs font-medium mb-1">SĐT</span>
        <span className="font-semibold text-base">{patient.patient_phone || "—"}</span>
      </div>
    </div>
    
    <div className="text-white">
      <div className="flex flex-col">
        <span className="text-emerald-100 text-xs font-medium mb-1">Địa chỉ</span>
        <span className="font-medium text-sm">{patient.patient_address || "—"}</span>
      </div>
    </div>

    {/* Conclusion Input */}
    <div className="bg-white rounded-t-xl p-4 shadow-sm border-t border-x border-emerald-100 -mx-4 -mb-4 mt-4">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Kết luận <span className="text-red-500">*</span>
      </label>
      <textarea
        value={conclusion}
        onChange={(e) => setConclusion(e.target.value)}
        className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none placeholder:text-slate-400"
        placeholder="Nhập kết luận khám bệnh..."
        rows={3}
        disabled={disabled}
      />
    </div>
  </div>
);

export default PrescriptionInfoForm;