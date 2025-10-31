import dayjs from "dayjs";

const PatientInfoCard = ({ patient, diagnosis, setDiagnosis }) => (
  <div className="grid grid-cols-2 gap-4 mb-4">
    <div><strong>Họ và tên:</strong> {patient.patient_full_name || "—"}</div>
    <div><strong>Giới tính:</strong> {patient.patient_gender === "MALE" ? "Nam" : "Nữ"}</div>
    <div><strong>Năm sinh:</strong> {patient.patient_dob ? dayjs(patient.patient_dob).format("YYYY") : "—"}</div>
    <div><strong>Địa chỉ:</strong> {patient.patient_address || "—"}</div>
    <div className="col-span-2">
      <label className="font-semibold text-gray-700">Chẩn đoán lâm sàng</label>
      <textarea
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
        className="w-full border rounded-lg mt-1 px-3 py-2"
        placeholder="Nhập chẩn đoán lâm sàng..."
      />
    </div>
  </div>
);

export default PatientInfoCard;
