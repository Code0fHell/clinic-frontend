import dayjs from "dayjs";

const PatientInfoCard = ({ patient, diagnosis, setDiagnosis }) => (
  <div className="space-y-4">
    {/* Patient Info */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
      <div className="flex flex-col">
        <span className="text-blue-100 text-xs font-medium mb-1">Họ và tên</span>
        <span className="font-semibold text-base">{patient.patient_full_name || "—"}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-blue-100 text-xs font-medium mb-1">Giới tính</span>
        <span className="font-semibold text-base">{patient.patient_gender === "NAM" ? "Nam" : "Nữ"}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-blue-100 text-xs font-medium mb-1">Năm sinh</span>
        <span className="font-semibold text-base">{patient.patient_dob ? dayjs(patient.patient_dob).format("DD/MM/YYYY") : "—"}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-blue-100 text-xs font-medium mb-1">SĐT</span>
        <span className="font-semibold text-base">{patient.patient_phone || "—"}</span>
      </div>
    </div>
    
    <div className="text-white">
      <div className="flex flex-col">
        <span className="text-blue-100 text-xs font-medium mb-1">Địa chỉ</span>
        <span className="font-medium text-sm">{patient.patient_address || "—"}</span>
      </div>
    </div>

    {/* Diagnosis Input - Moved outside colored section */}
    <div className="bg-white rounded-t-xl p-4 shadow-sm border-t border-x border-blue-100 -mx-6 -mb-6 mt-4">
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Chẩn đoán lâm sàng <span className="text-red-500">*</span>
      </label>
      <textarea
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
        className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-400"
        placeholder="Nhập chẩn đoán lâm sàng của bệnh nhân..."
        rows={3}
      />
    </div>
  </div>
);

export default PatientInfoCard;
