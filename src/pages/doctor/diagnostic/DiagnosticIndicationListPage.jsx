import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../../components/layout/RoleBasedLayout";
import DoctorHeader from "../components/layout/DoctorHeader";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import Toast from "../../../components/modals/Toast";
import { formatUTCDate } from "../../../utils/dateUtils";

const DiagnosticIndicationListPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    // Dữ liệu mẫu - danh sách bệnh nhân được chỉ định chẩn đoán hình ảnh
    const [indications] = useState([
        {
            id: "ind-diag-001",
            barcode: "DIAG001234567",
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
            diagnosis: "Ho kéo dài 3 tuần, đau ngực, nghi ngờ viêm phổi",
            indication_date: "2024-12-07T08:00:00",
            total_fee: 200000,
            serviceItems: [
                {
                    id: "si-001",
                    medical_service: {
                        name: "X-quang phổi trước sau",
                        description: "Chụp X-quang phổi tư thế thẳng trước sau",
                    },
                    quantity: 1,
                },
                {
                    id: "si-002",
                    medical_service: {
                        name: "X-quang phổi nghiêng",
                        description: "Chụp X-quang phổi tư thế nghiêng",
                    },
                    quantity: 1,
                },
            ],
        },
        {
            id: "ind-diag-002",
            barcode: "DIAG001234568",
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
            diagnosis: "Khó thở, ho ra máu, nghi ngờ lao phổi",
            indication_date: "2024-12-07T09:30:00",
            total_fee: 300000,
            serviceItems: [
                {
                    id: "si-003",
                    medical_service: {
                        name: "X-quang phổi 2 tư thế",
                        description: "Chụp X-quang phổi trước sau và nghiêng để phát hiện tổn thương",
                    },
                    quantity: 1,
                },
                {
                    id: "si-004",
                    medical_service: {
                        name: "Chụp CT ngực",
                        description: "Chụp cắt lớp vi tính ngực để đánh giá chi tiết",
                    },
                    quantity: 1,
                },
            ],
        },
        {
            id: "ind-diag-003",
            barcode: "DIAG001234569",
            patient: {
                id: "p-003",
                patient_full_name: "Phạm Minh Tuấn",
                patient_dob: "1988-03-10",
                patient_phone: "0927345678",
                patient_address: "890 Cách Mạng Tháng 8, Q3, TP.HCM",
                patient_gender: "Nam",
            },
            doctor: {
                id: "d-001",
                user: {
                    full_name: "BS. Nguyễn Hữu Thọ",
                },
            },
            diagnosis: "Thở khò khè, nghi ngờ hen phế quản cấp",
            indication_date: "2024-12-07T10:45:00",
            total_fee: 150000,
            serviceItems: [
                {
                    id: "si-005",
                    medical_service: {
                        name: "X-quang lồng ngực",
                        description: "Chụp X-quang lồng ngực để đánh giá tình trạng phổi",
                    },
                    quantity: 1,
                },
            ],
        },
    ]);

    const handleViewDetail = (indication) => {
        navigate(`/diagnostic/indication/${indication.id}/result`, {
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
                                Danh sách bệnh nhân chỉ định chẩn đoán hình ảnh
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
                                Chưa có bệnh nhân nào được chỉ định chẩn đoán hình ảnh
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

export default DiagnosticIndicationListPage;


