import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../../components/layout/RoleBasedLayout";
import DoctorHeader from "../components/layout/DoctorHeader";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import Toast from "../../../components/modals/Toast";
import LabResultPrintModal from "./LabResultPrintModal";
import { formatUTCDate } from "../../../utils/dateUtils";

const LabCompletedResultsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedResult, setSelectedResult] = useState(null);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    // Dữ liệu mẫu - danh sách kết quả đã xử lý
    const [completedResults] = useState([
        {
            id: "result-001",
            barcode: "LAB001234567",
            indication: {
                id: "ind-001",
                barcode: "IND001234567",
                diagnosis: "Nghi ngờ viêm gan B, cần xét nghiệm HBsAg",
                indication_date: "2024-12-06T08:30:00",
            },
            patient: {
                id: "p-001",
                patient_full_name: "Nguyễn Văn An",
                patient_dob: "1985-03-15",
                patient_phone: "0901234567",
                patient_address: "123 Lê Lợi, Q1, TP.HCM",
                patient_gender: "Nam",
            },
            doctor: {
                id: "d-001",
                user: {
                    full_name: "BS. Trần Thị Bình",
                },
            },
            testResults: [
                {
                    serviceName: "Xét nghiệm HBsAg",
                    result: "Âm tính",
                    unit: "",
                    normalRange: "Âm tính",
                },
                {
                    serviceName: "Xét nghiệm công thức máu",
                    result: "WBC: 7.5, RBC: 4.8, HGB: 14.2",
                    unit: "10^9/L, 10^12/L, g/dL",
                    normalRange: "WBC: 4-10, RBC: 4.5-5.5, HGB: 13-17",
                },
            ],
            conclusion: "Kết quả xét nghiệm HBsAg âm tính, không phát hiện dấu hiệu viêm gan B. Công thức máu trong giới hạn bình thường.",
            created_at: "2024-12-06T14:30:00",
        },
        {
            id: "result-002",
            barcode: "LAB001234568",
            indication: {
                id: "ind-002",
                barcode: "IND001234568",
                diagnosis: "Kiểm tra sức khỏe định kỳ",
                indication_date: "2024-12-06T09:00:00",
            },
            patient: {
                id: "p-002",
                patient_full_name: "Lê Thị Cẩm",
                patient_dob: "1992-07-20",
                patient_phone: "0912345678",
                patient_address: "456 Nguyễn Huệ, Q1, TP.HCM",
                patient_gender: "Nữ",
            },
            doctor: {
                id: "d-002",
                user: {
                    full_name: "BS. Phạm Minh Đức",
                },
            },
            testResults: [
                {
                    serviceName: "Xét nghiệm sinh hóa máu",
                    result: "Glucose: 92, Cholesterol: 180, Triglyceride: 120",
                    unit: "mg/dL",
                    normalRange: "Glucose: 70-110, Cholesterol: <200, Triglyceride: <150",
                },
                {
                    serviceName: "Xét nghiệm chức năng gan",
                    result: "AST: 28, ALT: 32, Bilirubin: 0.8",
                    unit: "U/L, mg/dL",
                    normalRange: "AST: <40, ALT: <40, Bilirubin: 0.3-1.2",
                },
            ],
            conclusion: "Các chỉ số sinh hóa máu và chức năng gan đều trong giới hạn bình thường. Bệnh nhân có sức khỏe tốt.",
            created_at: "2024-12-06T15:00:00",
        },
    ]);

    const handlePrint = (result) => {
        setSelectedResult(result);
        setShowPrintModal(true);
    };

    const handleClosePrintModal = () => {
        setShowPrintModal(false);
        setSelectedResult(null);
    };

    return (
        <RoleBasedLayout>
            <DoctorHeader />
            <div className="flex h-[calc(100vh-80px)]">
                <DoctorSidebar />
                <main className="flex-1 p-8 overflow-auto bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">
                                Danh sách kết quả đã xử lý
                            </h1>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate("/lab/indications")}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Danh sách chỉ định
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Làm mới
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="text-gray-500">Đang tải...</div>
                            </div>
                        ) : completedResults.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                                Chưa có kết quả xét nghiệm nào
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {completedResults.map((result) => (
                                    <div
                                        key={result.id}
                                        className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        {result.patient?.patient_full_name}
                                                    </h3>
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                                        {result.barcode || result.id}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <span className="font-medium">Ngày sinh:</span>{" "}
                                                        {formatUTCDate(result.patient?.patient_dob, "DD/MM/YYYY")}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Giới tính:</span>{" "}
                                                        {result.patient?.patient_gender}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Số điện thoại:</span>{" "}
                                                        {result.patient?.patient_phone}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">BS chỉ định:</span>{" "}
                                                        {result.doctor?.user?.full_name}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handlePrint(result)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
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
                                                In kết quả
                                            </button>
                                        </div>

                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="mb-3">
                                                <span className="font-medium text-gray-700">Chẩn đoán:</span>
                                                <p className="text-gray-600 mt-1">
                                                    {result.indication?.diagnosis}
                                                </p>
                                            </div>

                                            <div className="mb-3">
                                                <span className="font-medium text-gray-700">Kết quả xét nghiệm:</span>
                                                <div className="mt-2 space-y-2">
                                                    {result.testResults?.map((test, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="bg-gray-50 p-3 rounded border border-gray-200"
                                                        >
                                                            <div className="font-medium text-gray-800 mb-1">
                                                                {test.serviceName}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                <span className="font-medium">Kết quả:</span> {test.result}
                                                                {test.unit && ` (${test.unit})`}
                                                            </div>
                                                            {test.normalRange && (
                                                                <div className="text-sm text-gray-500">
                                                                    <span className="font-medium">Giá trị tham chiếu:</span>{" "}
                                                                    {test.normalRange}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <span className="font-medium text-gray-700">Kết luận:</span>
                                                <p className="text-gray-800 bg-blue-50 p-3 rounded mt-1">
                                                    {result.conclusion}
                                                </p>
                                            </div>

                                            <div className="mt-3 text-sm text-gray-500">
                                                Ngày thực hiện: {formatUTCDate(result.created_at, "DD/MM/YYYY HH:mm")}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {showPrintModal && selectedResult && (
                <LabResultPrintModal
                    result={selectedResult}
                    onClose={handleClosePrintModal}
                />
            )}

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </RoleBasedLayout>
    );
};

export default LabCompletedResultsPage;

