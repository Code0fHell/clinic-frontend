import React from "react";

const PrescriptionDetailModal = ({ prescription, onClose }) => {
  if (!prescription) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Chi tiết đơn thuốc</h2>
              <p className="text-green-100 text-sm mt-1">
                Phòng khám PMedClinic
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Ngày kê đơn</p>
              <p className="font-semibold text-gray-800">
                {prescription.created_at
                  ? new Date(prescription.created_at).toLocaleDateString(
                        "vi-VN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                    )
                  : "--"}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Bác sĩ kê đơn</p>
              <p className="font-semibold text-gray-800">
                {prescription.doctor?.user?.full_name || "--"}
              </p>
            </div>
          </div>

          {/* Kết luận */}
          {prescription.conclusion && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <p className="text-sm text-gray-600 mb-2">Kết luận</p>
              <p className="text-base text-gray-800 whitespace-pre-line">
                {prescription.conclusion}
              </p>
            </div>
          )}

          {/* Chi tiết thuốc */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Danh sách thuốc
            </h3>
            <div className="space-y-3">
              {prescription.details && prescription.details.length > 0 ? (
                prescription.details.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <h4 className="font-semibold text-gray-800">
                            {item.medicine?.name || "--"}
                          </h4>
                        </div>
                        <div className="ml-8 space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Số lượng:</span>{" "}
                            {item.quantity} {item.unit || ""}
                          </p>
                          {item.usage && (
                            <p>
                              <span className="font-medium">Cách dùng:</span>{" "}
                              {item.usage}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
                  Không có thuốc nào trong đơn
                </div>
              )}
            </div>
          </div>

          {/* Tổng tiền */}
          {prescription.total_price && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">
                  Tổng tiền:
                </span>
                <span className="text-2xl font-bold text-green-600">
                  {prescription.total_price.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetailModal;