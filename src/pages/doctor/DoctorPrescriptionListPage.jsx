import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../components/layout/RoleBasedLayout";
import DoctorHeader from "./components/layout/DoctorHeader";
import DoctorSidebar from "./components/layout/DoctorSidebar";
import { getAllPrescriptions } from "../../api/prescription.api";
import { formatUTCDate } from "../../utils/dateUtils";
import Toast from "../../components/modals/Toast";

const DoctorPrescriptionListPage = () => {
    const navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            setLoading(true);
            const res = await getAllPrescriptions();
            const data = res.data || res;
            setPrescriptions(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Lỗi khi tải danh sách đơn thuốc:", err);
            setToast({
                show: true,
                message: "Không thể tải danh sách đơn thuốc",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleView = (id) => {
        navigate(`/doctor/prescription/${id}`);
    };

    const handleEdit = (id) => {
        navigate(`/doctor/prescription/${id}/edit`);
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
                                Danh sách đơn thuốc
                            </h1>
                            <button
                                onClick={fetchPrescriptions}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Làm mới
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="text-gray-500">Đang tải...</div>
                            </div>
                        ) : prescriptions.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                                Chưa có đơn thuốc nào
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Mã đơn
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Bệnh nhân
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Kết luận
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Ngày tạo
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Tổng tiền
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {prescriptions.map((prescription) => (
                                            <tr
                                                key={prescription.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {prescription.id.slice(0, 8)}...
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {prescription.patient?.patient_full_name ||
                                                        "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {prescription.conclusion
                                                        ? prescription.conclusion.length > 50
                                                            ? prescription.conclusion.substring(
                                                                  0,
                                                                  50
                                                              ) + "..."
                                                            : prescription.conclusion
                                                        : "--"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatUTCDate(
                                                        prescription.created_at,
                                                        "DD/MM/YYYY HH:mm"
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Intl.NumberFormat("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    }).format(
                                                        prescription.total_fee || 0
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleView(prescription.id)
                                                            }
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Xem
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(prescription.id)
                                                            }
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Sửa
                                                        </button>
                                                    </div>
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

export default DoctorPrescriptionListPage;

