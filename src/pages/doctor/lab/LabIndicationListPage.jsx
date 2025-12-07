import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../../components/layout/RoleBasedLayout";
import DoctorHeader from "../components/layout/DoctorHeader";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import Toast from "../../../components/modals/Toast";
import { formatUTCDate } from "../../../utils/dateUtils";

const LabIndicationListPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    // Dữ liệu mẫu - danh sách bệnh nhân được chỉ định xét nghiệm
    const [indications] = useState([
        {
            id: "ind-001",
            barcode: "IND001234567",
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
            diagnosis: "Nghi ngờ viêm gan B, cần xét nghiệm HBsAg",
            indication_date: "2024-12-06T08:30:00",
            total_fee: 350000,
            serviceItems: [
                {
                    id: "si-001",
                    medical_service: {
                        name: "Xét nghiệm HBsAg",
                        description: "Xét nghiệm kháng nguyên bề mặt viêm gan B",
                    },
                    quantity: 1,
                },
                {
                    id: "si-002",
                    medical_service: {
                        name: "Xét nghiệm công thức máu",
                        description: "Đếm số lượng các loại tế bào máu",
                    },
                    quantity: 1,
                },
            ],
        },
        {
            id: "ind-002",
            barcode: "IND001234568",
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
            diagnosis: "Kiểm tra sức khỏe định kỳ",
            indication_date: "2024-12-06T09:00:00",
            total_fee: 450000,
            serviceItems: [
                {
                    id: "si-003",
                    medical_service: {
                        name: "Xét nghiệm sinh hóa máu",
                        description: "Glucose, Cholesterol, Triglyceride",
                    },
                    quantity: 1,
                },
                {
                    id: "si-004",
                    medical_service: {
                        name: "Xét nghiệm chức năng gan",
                        description: "AST, ALT, Bilirubin",
                    },
                    quantity: 1,
                },
            ],
        },
        {
            id: "ind-003",
            barcode: "IND001234569",
            patient: {
                id: "p-003",
                patient_full_name: "Trần Văn Đông",
                patient_dob: "1978-11-05",
                patient_phone: "0923456789",
                patient_address: "789 Lý Tự Trọng, Q1, TP.HCM",
                patient_gender: "Nam",
            },
            doctor: {
                id: "d-001",
                user: {
                    full_name: "BS. Trần Thị Bình",
                },
            },
            diagnosis: "Đau bụng, cần kiểm tra chức năng thận",
            indication_date: "2024-12-06T10:15:00",
            total_fee: 280000,
            serviceItems: [
                {
                    id: "si-005",
                    medical_service: {
                        name: "Xét nghiệm nước tiểu",
                        description: "Phân tích nước tiểu tổng quát",
                    },
                    quantity: 1,
                },
                {
                    id: "si-006",
                    medical_service: {
                        name: "Xét nghiệm Creatinine",
                        description: "Kiểm tra chức năng thận",
                    },
                    quantity: 1,
                },
            ],
        },
    ]);

    const handleViewDetail = (indication) => {
        navigate(`/lab/indication/${indication.id}/result`, {
            state: { indication },
        });
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
                                Danh sách bệnh nhân chỉ định xét nghiệm
                            </h1>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Làm mới
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="text-gray-500">Đang tải...</div>
                            </div>
                        ) : indications.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                                Chưa có bệnh nhân nào được chỉ định xét nghiệm
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Mã phiếu
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Bệnh nhân
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Bác sĩ chỉ định
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Chẩn đoán
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Ngày chỉ định
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {indications.map((indication) => (
                                            <tr
                                                key={indication.id}
                                                className="hover:bg-gray-50 cursor-pointer"
                                                onClick={() => handleViewDetail(indication)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                    {indication.barcode || indication.id.slice(0, 8)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {indication.patient?.patient_full_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {indication.patient?.patient_phone}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {indication.doctor?.user?.full_name || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {indication.diagnosis
                                                        ? indication.diagnosis.length > 50
                                                            ? indication.diagnosis.substring(0, 50) + "..."
                                                            : indication.diagnosis
                                                        : "--"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatUTCDate(
                                                        indication.indication_date,
                                                        "DD/MM/YYYY HH:mm"
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewDetail(indication);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Nhập kết quả
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>

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

export default LabIndicationListPage;

