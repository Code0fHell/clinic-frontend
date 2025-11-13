import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const PrescriptionDetailModal = ({ prescription, onClose }) => {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "DonThuoc",
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-[600px] relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          ×
        </button>
        <div ref={printRef} className="print:bg-white">
          <div className="font-bold text-lg mb-2">PHÒNG KHÁM PMED CLINIC</div>
          <h2 className="text-xl font-bold text-center mb-4">Đơn thuốc</h2>
          <div className="mb-2">
            <div><b>Họ và tên:</b> {prescription.patient.patient_full_name}</div>
            <div><b>Năm sinh:</b> {prescription.patient.patient_dob ? new Date(prescription.patient.patient_dob).getFullYear() : ""}</div>
            <div><b>Địa chỉ:</b> {prescription.patient.patient_address}</div>
            <div><b>Kết luận:</b> {prescription.conclusion}</div>
          </div>
          <div className="mt-2">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-1 px-2">STT</th>
                  <th className="py-1 px-2">Tên thuốc</th>
                  <th className="py-1 px-2">Số lượng</th>
                  <th className="py-1 px-2">Đơn vị</th>
                  <th className="py-1 px-2">Công dụng</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medicines.map((m, idx) => (
                  <tr key={m.id || idx}>
                    <td className="py-1 px-2 text-center">{idx + 1}</td>
                    <td className="py-1 px-2">{m.name}</td>
                    <td className="py-1 px-2">{m.quantity}</td>
                    <td className="py-1 px-2">{m.unit}</td>
                    <td className="py-1 px-2">{m.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-end mt-6">
            <div>
              <div>
                <b>Bác sĩ kê đơn:</b> {prescription.doctor?.user?.full_name || ""}
                <div className="border-b border-gray-400 w-40 mt-2"></div>
                <span className="italic text-xs text-gray-400">(Ký tên)</span>
              </div>
            </div>
          </div>
        </div>
        <button
          className="absolute left-4 bottom-4 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handlePrint}
        >
          In đơn thuốc
        </button>
      </div>
    </div>
  );
};

export default PrescriptionDetailModal;