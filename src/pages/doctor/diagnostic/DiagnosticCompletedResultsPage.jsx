import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../../components/layout/RoleBasedLayout";
import DoctorHeader from "../components/layout/DoctorHeader";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import Toast from "../../../components/modals/Toast";
import DiagnosticResultPrintModal from "./DiagnosticResultPrintModal";
import { formatUTCDate } from "../../../utils/dateUtils";

const DiagnosticCompletedResultsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedResult, setSelectedResult] = useState(null);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    // Dữ liệu mẫu - danh sách kết quả đã xử lý với ảnh giả lập
    const [completedResults] = useState([
        {
            id: "result-diag-001",
            barcode: "DIAGRES001234567",
            indication: {
                id: "ind-diag-001",
                barcode: "DIAG001234567",
                diagnosis: "Ho kéo dài 3 tuần, đau ngực, nghi ngờ viêm phổi",
                indication_date: "2024-12-07T08:00:00",
            },
            patient: {
                id: "p-001",
                patient_full_name: "Trần Văn Bình",
                patient_dob: "1980-05-20",
                patient_phone: "0905123456",
                patient_address: "234 Võ Văn Tần, Q3, TP.HCM",
                patient_gender: "Nam",
            },
            doctor: {
                id: "d-001",
                user: {
                    full_name: "BS. Nguyễn Hữu Thọ",
                },
            },
            serviceNames: ["X-quang phổi trước sau", "X-quang phổi nghiêng"],
            images: [
                "https://images.unsplash.com/photo-1631651363531-fd29aec4cb5c?q=80&w=776&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "https://images.unsplash.com/photo-1631651363531-fd29aec4cb5c?q=80&w=776&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            ],
            description: "Hình ảnh X-quang cho thấy đám mờ dạng thâm nhiễm khu trú ở thùy dưới phổi phải, ranh giới không rõ. Góc sườn hoành phải nhẹ độ tù. Không thấy hình ảnh tràn khí màng phổi. Tim to ranh giới bình thường. Xương sườn, xương đốt sống không có tổn thương.",
            conclusion: "Viêm phổi thùy dưới phổi phải. Khuyến nghị: Điều trị kháng sinh theo phác đồ, tái khám sau 1 tuần để đánh giá đáp ứng điều trị.",
            created_at: "2024-12-07T14:30:00",
        },
        {
            id: "result-diag-002",
            barcode: "DIAGRES001234568",
            indication: {
                id: "ind-diag-002",
                barcode: "DIAG001234568",
                diagnosis: "Khó thở, ho ra máu, nghi ngờ lao phổi",
                indication_date: "2024-12-07T09:30:00",
            },
            patient: {
                id: "p-002",
                patient_full_name: "Nguyễn Thị Mai",
                patient_dob: "1995-08-15",
                patient_phone: "0916234567",
                patient_address: "567 Lý Thường Kiệt, Q10, TP.HCM",
                patient_gender: "Nữ",
            },
            doctor: {
                id: "d-002",
                user: {
                    full_name: "BS. Lê Văn Hùng",
                },
            },
            serviceNames: ["X-quang phổi 2 tư thế", "Chụp CT ngực"],
            images: [
                "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
            ],
            description: "X-quang phổi: Hình ảnh đám mờ dạng đốm vón cục khu trú ở thùy trên phổi phải, ranh giới không đều. CT ngực: Tổn thương dạng hang ở đỉnh phổi phải, có hình ảnh dày thành. Hạch trung thất không to. Không có tràn dịch màng phổi.",
            conclusion: "Lao phổi thùy trên phổi phải có hang. Khuyến nghị: Điều trị lao theo phác đồ 6 tháng, cách ly, tái khám định kỳ hàng tháng. Xét nghiệm đờm để xác định vi khuẩn lao.",
            created_at: "2024-12-07T15:00:00",
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
                                    onClick={() => navigate("/diagnostic/indications")}
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
                                Chưa có kết quả chẩn đoán hình ảnh nào
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
                                                <span className="font-medium text-gray-700">Dịch vụ thực hiện:</span>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {result.serviceNames?.map((name, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                                        >
                                                            {name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Hiển thị ảnh thumbnail */}
                                            {result.images && result.images.length > 0 && (
                                                <div className="mb-3">
                                                    <span className="font-medium text-gray-700">Hình ảnh chẩn đoán:</span>
                                                    <div className="mt-2 grid grid-cols-4 gap-2">
                                                        {result.images.map((image, idx) => (
                                                            <img
                                                                key={idx}
                                                                src={image}
                                                                alt={`Ảnh ${idx + 1}`}
                                                                className="w-full h-24 object-cover rounded border border-gray-300 cursor-pointer hover:opacity-80 transition"
                                                                onClick={() => window.open(image, '_blank')}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {result.description && (
                                                <div className="mb-3">
                                                    <span className="font-medium text-gray-700">Mô tả:</span>
                                                    <p className="text-gray-600 mt-1 bg-gray-50 p-3 rounded">
                                                        {result.description}
                                                    </p>
                                                </div>
                                            )}

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
                <DiagnosticResultPrintModal
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

export default DiagnosticCompletedResultsPage;


