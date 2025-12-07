import React, { useEffect, useState } from "react";
import { getPatientHistory } from "../../../../api/medical-record.api";
import { updatePatientVitals } from "../../../../api/patient.api";
import formatCurrency from "../../../../utils/formatCurrency";
import Toast from "../../../../components/modals/Toast";

const statusColorMap = {
  FOLLOW_UP: "bg-amber-100 text-amber-700",
  FIRST_VISIT: "bg-emerald-100 text-emerald-700",
  REGULAR: "bg-blue-100 text-blue-700",
};

const PatientHistoryDrawer = ({ patientId, onClose }) => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savingVitals, setSavingVitals] = useState(false);
  const [vitalForm, setVitalForm] = useState({
    height: "",
    weight: "",
    blood_pressure: "",
    respiratory_rate: "",
    pulse_rate: "",
    medical_history: "",
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const canEditVitals =
    history?.follow_up_status?.status === "FIRST_VISIT" ||
    history?.follow_up_status?.status === "REGULAR";

  useEffect(() => {
    if (!patientId) return;
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getPatientHistory(patientId);
        setHistory(data);
        setVitalForm({
          height: data.patient?.height ?? "",
          weight: data.patient?.weight ?? "",
          blood_pressure: data.patient?.blood_pressure ?? "",
          respiratory_rate: data.patient?.respiratory_rate ?? "",
          pulse_rate: data.patient?.pulse_rate ?? "",
          medical_history: data.patient?.medical_history ?? "",
        });
        setError("");
      } catch (err) {
        console.error("History error:", err);
        setError(
          err?.response?.message ||
            err?.message ||
            "Không thể tải lịch sử bệnh nhân"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [patientId]);

  const handleVitalChange = (e) => {
    const { name, value } = e.target;
    setVitalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveVitals = async (e) => {
    e.preventDefault();
    if (!patientId) return;
    try {
      setSavingVitals(true);
      const payload = {
        ...vitalForm,
        height: vitalForm.height ? Number(vitalForm.height) : undefined,
        weight: vitalForm.weight ? Number(vitalForm.weight) : undefined,
        pulse_rate: vitalForm.pulse_rate
          ? Number(vitalForm.pulse_rate)
          : undefined,
      };
      await updatePatientVitals(patientId, payload);
      setToast({
        show: true,
        message: "Đã cập nhật thông tin sinh hiệu",
        type: "success",
      });
    } catch (err) {
      const message =
        err?.response?.message || err?.message || "Không thể cập nhật sinh hiệu";
      setToast({ show: true, message, type: "error" });
    } finally {
      setSavingVitals(false);
    }
  };

  if (!patientId) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <div className="w-full max-w-3xl bg-white h-full overflow-y-auto p-6 relative">
        <button
          className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>

        {loading && <p className="text-gray-500 mt-10">Đang tải dữ liệu...</p>}
        {error && (
          <p className="text-red-500 mt-10 font-medium">
            {error}
          </p>
        )}

        {history && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {history.patient?.patient_full_name}
                </h2>
                <p className="text-gray-500">
                  Mã bệnh nhân: {history.patient?.id}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  statusColorMap[history.follow_up_status?.status] ||
                  "bg-gray-100 text-gray-600"
                }`}
              >
                {history.follow_up_status?.status === "FOLLOW_UP"
                  ? "Tái khám"
                  : history.follow_up_status?.status === "FIRST_VISIT"
                  ? "Lần khám đầu"
                  : "Đang điều trị"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Ngày sinh</p>
                <p className="font-semibold">
                  {history.patient?.patient_dob
                    ? new Date(history.patient.patient_dob).toLocaleDateString(
                        "vi-VN"
                      )
                    : "--"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-semibold">
                  {history.patient?.patient_phone || "--"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Chiều cao</p>
                <p className="font-semibold">
                  {history.patient?.height ? `${history.patient.height} cm` : "--"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Cân nặng</p>
                <p className="font-semibold">
                  {history.patient?.weight ? `${history.patient.weight} kg` : "--"}
                </p>
              </div>
            </div>

            {canEditVitals && (
              <form
                onSubmit={handleSaveVitals}
                className="bg-white border rounded-2xl p-4 shadow-sm mb-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Cập nhật sinh hiệu
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Chiều cao (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={vitalForm.height}
                      onChange={handleVitalChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Cân nặng (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={vitalForm.weight}
                      onChange={handleVitalChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Huyết áp</label>
                    <input
                      type="text"
                      name="blood_pressure"
                      value={vitalForm.blood_pressure}
                      onChange={handleVitalChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Nhịp thở</label>
                    <input
                      type="text"
                      name="respiratory_rate"
                      value={vitalForm.respiratory_rate}
                      onChange={handleVitalChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Mạch</label>
                    <input
                      type="number"
                      name="pulse_rate"
                      value={vitalForm.pulse_rate}
                      onChange={handleVitalChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm text-gray-500">Tiền sử bệnh</label>
                  <textarea
                    name="medical_history"
                    value={vitalForm.medical_history}
                    onChange={handleVitalChange}
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div className="text-right mt-4">
                  <button
                    type="submit"
                    disabled={savingVitals}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      savingVitals
                        ? "bg-gray-200 text-gray-500"
                        : "bg-[#008080] text-white hover:bg-[#026868]"
                    }`}
                  >
                    {savingVitals ? "Đang lưu..." : "Lưu thông tin"}
                  </button>
                </div>
              </form>
            )}

            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Phiếu chỉ định gần đây
              </h3>
              {history.indication_tickets?.length ? (
                <div className="space-y-3">
                  {history.indication_tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="border rounded-xl p-3 text-sm text-gray-700"
                    >
                      <div className="flex justify-between">
                        <span className="font-semibold">
                          {new Date(ticket.indication_date).toLocaleString("vi-VN")}
                        </span>
                        <span>{formatCurrency(ticket.total_fee || 0)}</span>
                      </div>
                      <p>Chẩn đoán: {ticket.diagnosis || "--"}</p>
                      <ul className="list-disc list-inside text-xs text-gray-500 mt-1">
                        {ticket.serviceItems?.map((item) => (
                          <li key={item.id}>
                            {item.medical_service?.service_name} · Phòng{" "}
                            {item.medical_service?.room?.room_name} · STT{" "}
                            {item.queue_number}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Chưa có phiếu chỉ định.</p>
              )}
            </section>

            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Đơn thuốc trước đây
              </h3>
              {history.prescriptions?.length ? (
                <div className="space-y-3">
                  {history.prescriptions.map((pres) => (
                    <div
                      key={pres.id}
                      className="border rounded-xl p-3 text-sm text-gray-700"
                    >
                      <div className="flex justify-between">
                        <span className="font-semibold">
                          {new Date(pres.created_at).toLocaleDateString("vi-VN")}
                        </span>
                        <span>
                          {pres.return_date
                            ? `Hẹn tái khám: ${new Date(
                                pres.return_date
                              ).toLocaleDateString("vi-VN")}`
                            : ""}
                        </span>
                      </div>
                      <p>Kết luận: {pres.conclusion || "--"}</p>
                      <ul className="list-disc list-inside text-xs text-gray-500 mt-1">
                        {pres.details?.map((detail) => (
                          <li key={detail.id}>
                            {detail.medicine?.name} × {detail.quantity} (
                            {detail.dosage})
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Chưa có đơn thuốc.</p>
              )}
            </section>
          </>
        )}
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default PatientHistoryDrawer;

