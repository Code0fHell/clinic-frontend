import React from "react";

const PrescriptionDetailModal = ({ prescription, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
      <h2 className="text-xl font-bold mb-4 text-blue-700">Chi tiết đơn thuốc</h2>
      <div className="mb-2"><b>Ngày:</b> {prescription.created_at?.slice(0, 10)}</div>
      <div className="mb-2"><b>Bác sĩ:</b> {prescription.doctor_name}</div>
      <div className="mb-2"><b>Kết luận:</b> {prescription.conclusion}</div>
      <div className="mb-2"><b>Tổng tiền:</b> {prescription.total_price?.toLocaleString()}đ</div>
      <div className="mb-2"><b>Chi tiết thuốc:</b></div>
      <ul className="list-disc pl-6">
        {prescription.details?.map((item, idx) => (
          <li key={idx}>
            {item.medicine_name} - {item.quantity} {item.unit} ({item.usage})
          </li>
        ))}
      </ul>
      <button
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        onClick={onClose}
      >
        Đóng
      </button>
    </div>
  </div>
);

export default PrescriptionDetailModal;