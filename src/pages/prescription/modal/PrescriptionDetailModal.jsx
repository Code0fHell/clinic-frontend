import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";

const PrescriptionDetailModal = ({ prescription, onClose }) => {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `DonThuoc_${prescription?.id || "PMedClinic"}`,
    pageStyle: `
      @page { size: A5; margin: 15mm; }
      @media print {
        body { -webkit-print-color-adjust: exact !important; }
      }
    `,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[700px] relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          ×
        </button>

        <div ref={printRef}>
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="font-bold text-lg text-blue-700">PHÒNG KHÁM PMED CLINIC</h2>
            {prescription.barcode && (
              <div className="flex justify-center my-2">
                <Barcode value={prescription.barcode} height={20} displayValue />
              </div>
            )}
            <h3 className="font-bold text-xl mt-2">ĐƠN THUỐC</h3>
          </div>

          {/* Thông tin bệnh nhân */}
          <div className="mb-4 text-sm">
            <p><b>Họ và tên:</b> {prescription.patient.patient_full_name}</p>
            <p><b>Năm sinh:</b> {prescription.patient.patient_dob ? new Date(prescription.patient.patient_dob).getFullYear() : ""}</p>
            <p><b>Địa chỉ:</b> {prescription.patient.patient_address}</p>
            <p><b>Kết luận:</b> {prescription.conclusion}</p>
          </div>

          {/* Bảng thuốc */}
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
              {(prescription.details || prescription.medicines || []).map((m, idx) => {
                const medicine = m.medicine || m;
                return (
                  <tr key={m.id || idx}>
                    <td className="py-1 px-2 text-center">{idx + 1}</td>
                    <td className="py-1 px-2">{medicine.name}</td>
                    <td className="py-1 px-2 text-center">{m.quantity}</td>
                    <td className="py-1 px-2">{medicine.unit}</td>
                    <td className="py-1 px-2">{m.dosage || medicine.description || ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Chữ ký bác sĩ */}
          <div className="flex justify-end mt-6">
            <div className="text-center">
              <p>Bác sĩ kê đơn:</p>
              <div className="border-b border-gray-400 w-40 mt-2"></div>
              <p className="italic text-xs text-gray-400">(Ký tên)</p>
              <p className="font-medium mt-1">{prescription.doctor?.user?.full_name || " "}</p>
            </div>
          </div>
        </div>

        {/* Nút in */}
        <button
          className="absolute left-4 bottom-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handlePrint}
        >
          In đơn thuốc
        </button>
      </div>
    </div>
  );
};

export default PrescriptionDetailModal;
