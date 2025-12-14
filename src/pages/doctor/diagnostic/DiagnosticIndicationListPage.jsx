import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../../components/layout/RoleBasedLayout";
import DoctorHeader from "../components/layout/DoctorHeader";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import Toast from "../../../components/modals/Toast";
import { formatUTCDate } from "../../../utils/dateUtils";
import { getDiagnosticIndications } from "../../../api/imaging.api";

const DiagnosticIndicationListPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [indications, setIndications] = useState([]);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    // Fetch indications from API
    useEffect(() => {
        const fetchIndications = async () => {
            try {
                setLoading(true);
                const data = await getDiagnosticIndications();
                setIndications(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Lỗi khi tải danh sách chỉ định:", error);
                setToast({
                    show: true,
                    message:
                        error?.message ||
                        "Không thể tải danh sách chỉ định chẩn đoán hình ảnh",
                    type: "error",
                });
                setIndications([]);
            } finally {
                setLoading(false);
            }
        };
        fetchIndications();
    }, []);

    const handleRefresh = async () => {
        try {
            setLoading(true);
            const data = await getDiagnosticIndications();
            setIndications(Array.isArray(data) ? data : []);
            setToast({
                show: true,
                message: "Đã làm mới danh sách",
                type: "success",
            });
        } catch (error) {
            console.error("Lỗi khi làm mới danh sách:", error);
            setToast({
                show: true,
                message: error?.message || "Không thể làm mới danh sách",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };
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
                                onClick={handleRefresh}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Đang tải..." : "Làm mới"}
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="text-gray-500">Đang tải...</div>
                            </div>
                        ) : indications.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                                Chưa có bệnh nhân nào được chỉ định chẩn đoán
                                hình ảnh
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
                                                onClick={() =>
                                                    handleViewDetail(indication)
                                                }
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                    {indication.barcode ||
                                                        indication.id.slice(
                                                            0,
                                                            8
                                                        )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {
                                                            indication.patient
                                                                ?.patient_full_name
                                                        }
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {
                                                            indication.patient
                                                                ?.patient_phone
                                                        }
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {indication.doctor?.user
                                                        ?.full_name || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {indication.diagnosis
                                                        ? indication.diagnosis
                                                              .length > 50
                                                            ? indication.diagnosis.substring(
                                                                  0,
                                                                  50
                                                              ) + "..."
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
                                                            handleViewDetail(
                                                                indication
                                                            );
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
