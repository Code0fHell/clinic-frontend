import React, { useEffect, useState } from "react";
import { getPatientHistory } from "../api/medical-record.api";

const ProfilePage = () => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const patientId =
    storedUser?.patient?.id || storedUser?.patient_id || storedUser?.id;

  useEffect(() => {
    const fetchHistory = async () => {
      if (!patientId) {
        setError("Không tìm thấy mã bệnh nhân.");
        setLoading(false);
        return;
      }
      try {
        const data = await getPatientHistory(patientId);
        setHistory(data);
        setError("");
      } catch (err) {
        setError(
          err?.response?.message ||
            err?.message ||
            "Không thể tải hồ sơ bệnh án."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [patientId]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Hồ sơ bệnh án của tôi
      </h1>

      {loading && <p className="text-gray-500">Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {history && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Thông tin cá nhân
            </h2>
            <p>Họ tên: {history.patient?.patient_full_name}</p>
            <p>Số điện thoại: {history.patient?.patient_phone}</p>
            <p>Địa chỉ: {history.patient?.patient_address}</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Lịch sử đơn thuốc
            </h2>
            {history.prescriptions?.length ? (
              <ul className="space-y-3 text-gray-700">
                {history.prescriptions.map((pres) => (
                  <li
                    key={pres.id}
                    className="border rounded-xl p-3 text-sm bg-gray-50"
                  >
                    <p className="font-semibold">
                      {new Date(pres.created_at).toLocaleDateString("vi-VN")}
                    </p>
                    <p>Kết luận: {pres.conclusion || "--"}</p>
                    <p>
                      Tái khám:{" "}
                      {pres.return_date
                        ? new Date(pres.return_date).toLocaleDateString("vi-VN")
                        : "Không có"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Chưa có đơn thuốc.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;