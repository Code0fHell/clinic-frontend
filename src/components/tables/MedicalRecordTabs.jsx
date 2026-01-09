import React, { useState } from "react";
import IndicationDetailModal from "../modals/IndicationDetailModal";
import PrescriptionDetailModal from "../modals/PrescriptionDetailModal";
import LabTestDetailModal from "../modals/LabTestDetailModal";
import ImageResultDetailModal from "../modals/ImageResultDetailModal";

const MedicalRecordTabs = ({
    indications,
    prescriptions,
    labTestResults = [],
    imageResults = [],
}) => {
    const [tab, setTab] = useState("indication");
    const [selectedIndication, setSelectedIndication] = useState(null);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [selectedLabTest, setSelectedLabTest] = useState(null);
    const [selectedImageResult, setSelectedImageResult] = useState(null);
    console.log(prescriptions);
    const getTabCount = (tabName) => {
        switch (tabName) {
            case "indication":
                return indications.length;
            case "prescription":
                return prescriptions.length;
            case "labtest":
                return labTestResults.length;
            case "imaging":
                return imageResults.length;
            default:
                return 0;
        }
    };

    return (
        <div>
            <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
                <button
                    className={`pb-3 px-4 border-b-2 transition-all font-medium whitespace-nowrap flex items-center gap-2 ${
                        tab === "indication"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setTab("indication")}
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                    <span>Phiếu chỉ định</span>
                    {getTabCount("indication") > 0 && (
                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                            {getTabCount("indication")}
                        </span>
                    )}
                </button>
                <button
                    className={`pb-3 px-4 border-b-2 transition-all font-medium whitespace-nowrap flex items-center gap-2 ${
                        tab === "prescription"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setTab("prescription")}
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
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                    </svg>
                    <span>Đơn thuốc</span>
                    {getTabCount("prescription") > 0 && (
                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                            {getTabCount("prescription")}
                        </span>
                    )}
                </button>
                <button
                    className={`pb-3 px-4 border-b-2 transition-all font-medium whitespace-nowrap flex items-center gap-2 ${
                        tab === "labtest"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setTab("labtest")}
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>Kết quả xét nghiệm</span>
                    {getTabCount("labtest") > 0 && (
                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                            {getTabCount("labtest")}
                        </span>
                    )}
                </button>
                <button
                    className={`pb-3 px-4 border-b-2 transition-all font-medium whitespace-nowrap flex items-center gap-2 ${
                        tab === "imaging"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setTab("imaging")}
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
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <span>Kết quả chẩn đoán hình ảnh</span>
                    {getTabCount("imaging") > 0 && (
                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                            {getTabCount("imaging")}
                        </span>
                    )}
                </button>
            </div>
            {tab === "indication" && (
                <div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700">
                                    <th className="p-3 font-semibold text-left">STT</th>
                                    <th className="p-3 font-semibold text-left">Ngày chỉ định</th>
                                    <th className="p-3 font-semibold text-left">Bác sĩ</th>
                                    <th className="p-3 font-semibold text-center">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {indications.map((ind, idx) => (
                                    <tr
                                        key={ind.id}
                                        className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                                    >
                                        <td className="p-3 text-gray-600">
                                            {idx + 1}
                                        </td>
                                        <td className="p-3 text-gray-700">
                                            {ind.indication_date
                                                ? new Date(
                                                      ind.indication_date
                                                  ).toLocaleDateString("vi-VN")
                                                : "--"}
                                        </td>
                                        <td className="p-3 text-gray-700">
                                            {ind.doctor?.user?.full_name || "--"}
                                        </td>
                                        <td className="p-3 text-center">
                                            <button
                                                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                                onClick={() =>
                                                    setSelectedIndication(ind)
                                                }
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {selectedIndication && (
                        <IndicationDetailModal
                            indication={selectedIndication}
                            onClose={() => setSelectedIndication(null)}
                        />
                    )}
                </div>
            )}
            {tab === "prescription" && (
                <div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700">
                                    <th className="p-3 font-semibold text-left">STT</th>
                                    <th className="p-3 font-semibold text-left">Ngày kê đơn</th>
                                    <th className="p-3 font-semibold text-left">Bác sĩ</th>
                                    <th className="p-3 font-semibold text-left">Kết luận</th>
                                    <th className="p-3 font-semibold text-center">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prescriptions.map((pres, idx) => (
                                    <tr
                                        key={pres.id}
                                        className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                                    >
                                        <td className="p-3 text-gray-600">
                                            {idx + 1}
                                        </td>
                                        <td className="p-3 text-gray-700">
                                            {pres.created_at
                                                ? new Date(
                                                      pres.created_at
                                                  ).toLocaleDateString("vi-VN")
                                                : "--"}
                                        </td>
                                        <td className="p-3 text-gray-700">
                                            {pres.doctor?.user?.full_name || "--"}
                                        </td>
                                        <td className="p-3 text-gray-700 max-w-xs truncate">
                                            {pres.conclusion || "--"}
                                        </td>
                                        <td className="p-3 text-center">
                                            <button
                                                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                                onClick={() =>
                                                    setSelectedPrescription(pres)
                                                }
                                            >
                                                Xem đơn thuốc
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {selectedPrescription && (
                        <PrescriptionDetailModal
                            prescription={selectedPrescription}
                            onClose={() => setSelectedPrescription(null)}
                        />
                    )}
                </div>
            )}
            {tab === "labtest" && (
                <div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700">
                                    <th className="p-3 font-semibold text-left">STT</th>
                                    <th className="p-3 font-semibold text-left">Ngày</th>
                                    <th className="p-3 font-semibold text-left">Bác sĩ LAB</th>
                                    <th className="p-3 font-semibold text-left">Kết quả</th>
                                    <th className="p-3 font-semibold text-left">Kết luận</th>
                                    <th className="p-3 font-semibold text-center">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {labTestResults.map((lab, idx) => (
                                    <tr
                                        key={lab.id}
                                        className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                                    >
                                        <td className="p-3 text-gray-600">
                                            {idx + 1}
                                        </td>
                                        <td className="p-3 text-gray-700">
                                            {lab.created_at
                                                ? new Date(
                                                      lab.created_at
                                                  ).toLocaleDateString("vi-VN")
                                                : "--"}
                                        </td>
                                        <td className="p-3 text-gray-700">
                                            {lab.doctor?.user?.full_name ||
                                                lab.lab_staff_name ||
                                                "--"}
                                        </td>
                                        <td className="p-3 text-gray-700 max-w-xs truncate">
                                            {lab.result || "--"}
                                        </td>
                                        <td className="p-3 text-gray-700 max-w-xs truncate">
                                            {lab.conclusion || "--"}
                                        </td>
                                        <td className="p-3 text-center">
                                            <button
                                                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                                onClick={() =>
                                                    setSelectedLabTest(lab)
                                                }
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {selectedLabTest && (
                        <LabTestDetailModal
                            labTest={selectedLabTest}
                            onClose={() => setSelectedLabTest(null)}
                        />
                    )}
                </div>
            )}
            {tab === "imaging" && (
                <div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700">
                                    <th className="p-3 font-semibold text-left">STT</th>
                                    <th className="p-3 font-semibold text-left">Ngày</th>
                                    <th className="p-3 font-semibold text-left">Bác sĩ CĐHA</th>
                                    <th className="p-3 font-semibold text-left">Kết quả</th>
                                    <th className="p-3 font-semibold text-center">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {imageResults.map((img, idx) => (
                                    <tr
                                        key={img.id}
                                        className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                                    >
                                        <td className="p-3 text-gray-600">
                                            {idx + 1}
                                        </td>
                                        <td className="p-3 text-gray-700">
                                            {img.created_at
                                                ? new Date(
                                                      img.created_at
                                                  ).toLocaleDateString("vi-VN")
                                                : "--"}
                                        </td>
                                        <td className="p-3 text-gray-700">
                                            {img.doctor?.user?.full_name || "--"}
                                        </td>
                                        <td className="p-3 text-gray-700 max-w-xs truncate">
                                            {img.result || "--"}
                                        </td>
                                        <td className="p-3 text-center">
                                            <button
                                                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                                onClick={() =>
                                                    setSelectedImageResult(img)
                                                }
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {selectedImageResult && (
                        <ImageResultDetailModal
                            imageResult={selectedImageResult}
                            onClose={() => setSelectedImageResult(null)}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default MedicalRecordTabs;
