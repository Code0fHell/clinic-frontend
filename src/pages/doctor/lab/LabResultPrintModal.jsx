import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import { formatUTCDate } from "../../../utils/dateUtils";

const LabResultPrintModal = ({ result, onClose }) => {
    const printRef = useRef();

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `KetQuaXetNghiem_${result?.barcode || result?.id || "PMedClinic"}`,
        pageStyle: `
            @page { 
                size: A4; 
                margin: 15mm; 
            }
            @media print {
                body { 
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
            }
        `,
        onAfterPrint: () => {
            console.log("In hoàn tất");
        },
    });

    // Calculate age from date of birth
    const calculateAge = (dob) => {
        if (!dob) return "";
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[900px] max-h-[90vh] overflow-y-auto relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-3xl font-bold z-10"
                    onClick={onClose}
                >
                    ×
                </button>

                <div ref={printRef} className="p-8">
                    {/* Header */}
                    <div className="border-b-2 border-gray-300 pb-4 mb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="font-bold text-xl text-blue-700">PHÒNG KHÁM PMED CLINIC</h2>
                                <p className="text-sm text-gray-600">Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
                                <p className="text-sm text-gray-600">Điện thoại: (028) 1234 5678</p>
                            </div>
                            {result.barcode && (
                                <div className="flex flex-col items-center">
                                    <Barcode value={result.barcode} height={40} width={1.5} displayValue />
                                </div>
                            )}
                        </div>
                        <h3 className="font-bold text-2xl mt-4 text-center uppercase">
                            Phiếu kết quả xét nghiệm
                        </h3>
                    </div>

                    {/* Thông tin bệnh nhân */}
                    <div className="mb-6">
                        <h4 className="font-bold text-lg mb-3 text-gray-800 uppercase border-b border-gray-300 pb-2">
                            I. Thông tin bệnh nhân
                        </h4>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                            <div className="flex">
                                <span className="font-semibold w-32">Họ và tên:</span>
                                <span className="flex-1 uppercase">{result.patient?.patient_full_name}</span>
                            </div>
                            <div className="flex">
                                <span className="font-semibold w-32">Ngày sinh:</span>
                                <span className="flex-1">
                                    {formatUTCDate(result.patient?.patient_dob, "DD/MM/YYYY")}
                                    {" "}
                                    ({calculateAge(result.patient?.patient_dob)} tuổi)
                                </span>
                            </div>
                            <div className="flex">
                                <span className="font-semibold w-32">Giới tính:</span>
                                <span className="flex-1">{result.patient?.patient_gender}</span>
                            </div>
                            <div className="flex">
                                <span className="font-semibold w-32">Điện thoại:</span>
                                <span className="flex-1">{result.patient?.patient_phone}</span>
                            </div>
                            <div className="flex col-span-2">
                                <span className="font-semibold w-32">Địa chỉ:</span>
                                <span className="flex-1">{result.patient?.patient_address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin chỉ định */}
                    <div className="mb-6">
                        <h4 className="font-bold text-lg mb-3 text-gray-800 uppercase border-b border-gray-300 pb-2">
                            II. Thông tin chỉ định
                        </h4>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                            <div className="flex">
                                <span className="font-semibold w-40">Bác sĩ chỉ định:</span>
                                <span className="flex-1">{result.doctor?.user?.full_name}</span>
                            </div>
                            <div className="flex">
                                <span className="font-semibold w-40">Ngày chỉ định:</span>
                                <span className="flex-1">
                                    {formatUTCDate(result.indication?.indication_date, "DD/MM/YYYY HH:mm")}
                                </span>
                            </div>
                            <div className="flex col-span-2">
                                <span className="font-semibold w-40">Chẩn đoán:</span>
                                <span className="flex-1">{result.indication?.diagnosis}</span>
                            </div>
                        </div>
                    </div>

                    {/* Kết quả xét nghiệm */}
                    <div className="mb-6">
                        <h4 className="font-bold text-lg mb-3 text-gray-800 uppercase border-b border-gray-300 pb-2">
                            III. Kết quả xét nghiệm
                        </h4>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 py-2 px-3 text-left font-semibold w-8">
                                        STT
                                    </th>
                                    <th className="border border-gray-300 py-2 px-3 text-left font-semibold">
                                        Tên xét nghiệm
                                    </th>
                                    <th className="border border-gray-300 py-2 px-3 text-left font-semibold">
                                        Kết quả
                                    </th>
                                    <th className="border border-gray-300 py-2 px-3 text-left font-semibold w-24">
                                        Đơn vị
                                    </th>
                                    <th className="border border-gray-300 py-2 px-3 text-left font-semibold">
                                        Giá trị tham chiếu
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(result.testResults || []).map((test, idx) => (
                                    <tr key={idx}>
                                        <td className="border border-gray-300 py-2 px-3 text-center">
                                            {idx + 1}
                                        </td>
                                        <td className="border border-gray-300 py-2 px-3">
                                            {test.serviceName}
                                        </td>
                                        <td className="border border-gray-300 py-2 px-3 font-medium">
                                            {test.result}
                                        </td>
                                        <td className="border border-gray-300 py-2 px-3 text-sm">
                                            {test.unit || ""}
                                        </td>
                                        <td className="border border-gray-300 py-2 px-3 text-sm">
                                            {test.normalRange || ""}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Kết luận */}
                    <div className="mb-8">
                        <h4 className="font-bold text-lg mb-3 text-gray-800 uppercase border-b border-gray-300 pb-2">
                            IV. Kết luận
                        </h4>
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {result.conclusion}
                        </p>
                    </div>

                    {/* Chữ ký */}
                    <div className="flex justify-between mt-12">
                        <div className="text-center">
                            <p className="italic text-sm text-gray-600">
                                Ngày {formatUTCDate(result.created_at, "DD")} tháng {formatUTCDate(result.created_at, "MM")} năm {formatUTCDate(result.created_at, "YYYY")}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="font-semibold mb-16">BÁC SĨ XÉT NGHIỆM</p>
                            <div className="border-b border-gray-400 w-48 mb-1"></div>
                            <p className="italic text-sm text-gray-500">(Ký và ghi rõ họ tên)</p>
                        </div>
                    </div>

                    {/* Footer note */}
                    <div className="mt-8 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 italic text-center">
                            * Phiếu kết quả này chỉ có giá trị khi có đầy đủ chữ ký và con dấu của phòng khám
                        </p>
                        <p className="text-xs text-gray-500 italic text-center">
                            * Mọi thắc mắc xin liên hệ: (028) 1234 5678
                        </p>
                    </div>
                </div>

                {/* Nút in */}
                <div className="flex justify-center gap-4 mt-4 pt-4 border-t">
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        onClick={() => {
                            console.log("Bắt đầu in...");
                            handlePrint();
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        In phiếu kết quả
                    </button>
                    <button
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LabResultPrintModal;

