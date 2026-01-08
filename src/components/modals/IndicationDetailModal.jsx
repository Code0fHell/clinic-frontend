import React, { useRef } from "react";
import Barcode from "react-barcode";

const IndicationDetailModal = ({ indication, onClose }) => {
  console.log("indication: ", indication);
  const contentRef = useRef(null);


  if (!indication) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div
        ref={contentRef}
        className="bg-white rounded-xl shadow-xl w-[700px] p-6 relative"
      >
        {/* Close */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="font-bold text-lg text-blue-700">
            Phòng khám PMedClinic
          </h2>

          {indication.barcode && (
            <div className="flex justify-center my-2">
              <Barcode
                value={indication.barcode}
                height={20}
                displayValue
              />
            </div>
          )}

          <h3 className="font-bold text-xl mt-2">
            Phiếu chỉ định cận lâm sàng
          </h3>
        </div>

        {/* Thông tin bệnh nhân */}
        <div className="mb-4 text-sm">
          <p>
            <strong>Chẩn đoán lâm sàng:</strong>{" "}
            {indication.diagnosis || "--"}
          </p>
        </div>

        {/* Bảng dịch vụ */}
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 w-10">STT</th>
              <th className="border px-2 py-1">Tên dịch vụ</th>
              <th className="border px-2 py-1">Phòng</th>
              <th className="border px-2 py-1 w-20">Số thứ tự</th>
            </tr>
          </thead>
          <tbody>
            {indication.serviceItems?.map((item, idx) => (
              <tr key={item.id || idx}>
                <td className="border px-2 py-1 text-center">
                  {idx + 1}
                </td>
                <td className="border px-2 py-1">
                  {item.medical_service.service_name}
                </td>
                <td className="border px-2 py-1">
                  {item.medical_service.room.room_name || "--"}
                </td>
                <td className="border px-2 py-1 text-center">
                  {item.queue_number || "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="mt-4 text-sm flex justify-between items-end">
          <p>
            Ngày lập:{" "}
            {new Date(indication.indication_date).toLocaleString("vi-VN")}
          </p>

          <div className="text-center">
            <p>Bác sĩ chỉ định</p>
            <p>....................................</p>
            <p className="font-medium mt-1">
              {indication.doctor.user.full_name || " "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicationDetailModal;
