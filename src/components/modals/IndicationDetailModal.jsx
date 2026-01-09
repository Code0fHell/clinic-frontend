import React, { useRef } from "react";
import Barcode from "react-barcode";

const IndicationDetailModal = ({ indication, onClose }) => {
  const contentRef = useRef(null);


  if (!indication) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={contentRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
          onClick={onClose}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="text-center">
            <h2 className="font-bold text-xl mb-2">
              Phòng khám PMedClinic
            </h2>

            {indication.barcode && (
              <div className="flex justify-center my-3 bg-white p-2 rounded-lg">
                <Barcode
                  value={indication.barcode}
                  height={30}
                  displayValue
                  background="white"
                  lineColor="black"
                />
              </div>
            )}

            <h3 className="font-bold text-2xl mt-3">
              Phiếu chỉ định cận lâm sàng
            </h3>
          </div>
        </div>

        <div className="p-6">
          {/* Thông tin chẩn đoán */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-gray-600 mb-1">Chẩn đoán lâm sàng</p>
            <p className="text-base font-semibold text-gray-800">
              {indication.diagnosis || "--"}
            </p>
          </div>

          {/* Bảng dịch vụ */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Danh sách dịch vụ chỉ định
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <tr>
                    <th className="border-b px-4 py-3 text-left font-semibold text-gray-700">
                      STT
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold text-gray-700">
                      Tên dịch vụ
                    </th>
                    <th className="border-b px-4 py-3 text-left font-semibold text-gray-700">
                      Phòng
                    </th>
                    <th className="border-b px-4 py-3 text-center font-semibold text-gray-700">
                      Số thứ tự
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {indication.serviceItems?.length > 0 ? (
                    indication.serviceItems.map((item, idx) => (
                      <tr
                        key={item.id || idx}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="border-b px-4 py-3 text-gray-600">
                          {idx + 1}
                        </td>
                        <td className="border-b px-4 py-3 text-gray-800 font-medium">
                          {item.medical_service?.service_name || "--"}
                        </td>
                        <td className="border-b px-4 py-3 text-gray-700">
                          {item.medical_service?.room?.room_name || "--"}
                        </td>
                        <td className="border-b px-4 py-3 text-center text-gray-700">
                          {item.queue_number ? (
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                              {item.queue_number}
                            </span>
                          ) : (
                            "--"
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        Không có dịch vụ nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-end">
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Ngày lập</p>
              <p>
                {indication.indication_date
                  ? new Date(
                        indication.indication_date
                    ).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--"}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Bác sĩ chỉ định</p>
              <div className="border-t-2 border-gray-400 pt-2 mt-2">
                <p className="font-semibold text-gray-800">
                  {indication.doctor?.user?.full_name || "--"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicationDetailModal;
