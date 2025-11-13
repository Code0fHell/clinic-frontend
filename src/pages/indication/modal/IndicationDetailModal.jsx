import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const IndicationDetailModal = ({ ticket, onClose }) => {
  const ref = useRef();
  const handlePrint = useReactToPrint({ content: () => ref.current });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-[700px] p-6 relative" ref={ref}>
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="font-bold text-lg text-blue-700">Phòng khám PMedClinic</h2>
          <p className="text-sm">Barcode: {ticket.barcode}</p>
          <h3 className="font-bold text-xl mt-2">Phiếu chỉ định cận lâm sàng</h3>
        </div>

        {/* Thông tin bệnh nhân */}
        <div className="mb-4">
          <p><strong>Bệnh nhân:</strong> {ticket.patient?.full_name}</p>
          <p><strong>Chẩn đoán lâm sàng:</strong> {ticket.diagnosis}</p>
        </div>

        {/* Dịch vụ */}
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">STT</th>
              <th className="border px-2 py-1">Tên dịch vụ</th>
              <th className="border px-2 py-1">Phòng</th>
            </tr>
          </thead>
          <tbody>
            {ticket.service_items.map((s, idx) => (
              <tr key={s.medical_service_id}>
                <td className="border px-2 py-1">{idx + 1}</td>
                <td className="border px-2 py-1">{s.service_name}</td>
                <td className="border px-2 py-1">{s.room_name || "--"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-sm flex justify-between">
          <p>Ngày lập: {new Date(ticket.indication_date).toLocaleString("vi-VN")}</p>
          <p>Bác sĩ chỉ định: .......................................</p>
        </div>

        <div className="text-right mt-4">
          <button
            onClick={handlePrint}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            In phiếu chỉ định
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndicationDetailModal;
