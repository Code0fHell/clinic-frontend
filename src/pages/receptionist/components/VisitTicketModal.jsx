import React from "react";
import Barcode from "react-barcode";
import formatCurrency from "../../../utils/formatCurrency";

const VisitTicketModal = ({
  ticket,
  bill,
  payment,
  onCreateBill,
  onCreatePayment,
  onClose,
}) => {
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-semibold text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Phiếu khám lâm sàng
          </h2>
          <p className="text-gray-500">
            Queue #{ticket.queue_number} · Phòng {ticket.room_name || "N/A"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Bác sĩ phụ trách</p>
            <p className="font-semibold text-gray-800">
              {ticket.doctor_name || "--"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Số thứ tự phòng khám</p>
            <p className="font-semibold text-gray-800">
              {ticket.clinical_queue_number}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Barcode</p>
            {ticket.barcode ? (
              <div className="flex justify-center">
                <Barcode
                  value={ticket.barcode}
                  height={40}
                  displayValue={false}
                />
              </div>
            ) : (
              <p className="font-semibold text-gray-800">--</p>
            )}
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Phí khám</p>
            <p className="font-semibold text-gray-800">
              {formatCurrency(ticket.clinical_fee || 0)}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {!bill && (
            <button
              onClick={onCreateBill}
              className="w-full bg-[#008080] text-white py-3 rounded-xl font-semibold hover:bg-[#026868]"
            >
              Tạo hóa đơn khám
            </button>
          )}

          {bill && !payment && (
            <button
              onClick={onCreatePayment}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
            >
              Tạo mã QR thanh toán
            </button>
          )}

          {payment && (
            <div className="text-center">
              <p className="font-semibold text-gray-700 mb-2">
                Quét mã để thanh toán {formatCurrency(payment.amount)}
              </p>
              <img
                src={payment.qrCode}
                alt="VietQR"
                className="mx-auto w-64 h-64 object-contain border rounded-xl p-4 bg-white"
              />
              <p className="text-sm text-gray-500 mt-2">
                Nội dung: {payment.addInfo}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitTicketModal;

