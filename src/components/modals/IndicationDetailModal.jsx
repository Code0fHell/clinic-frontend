import React from "react";

const IndicationDetailModal = ({ indication, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
      <h2 className="text-xl font-bold mb-4 text-blue-700">Chi tiết phiếu chỉ định</h2>
      <div className="mb-2"><b>Ngày:</b> {indication.created_at?.slice(0, 10)}</div>
      <div className="mb-2"><b>Bác sĩ:</b> {indication.doctor_name}</div>
      <div className="mb-2"><b>Loại chỉ định:</b> {indication.type}</div>
      <div className="mb-2"><b>Ghi chú:</b> {indication.note}</div>
      <button
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        onClick={onClose}
      >
        Đóng
      </button>
    </div>
  </div>
);

export default IndicationDetailModal;