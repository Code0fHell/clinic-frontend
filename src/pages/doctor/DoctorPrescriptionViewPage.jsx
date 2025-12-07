import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../components/layout/RoleBasedLayout";
import DoctorHeader from "./components/layout/DoctorHeader";
import DoctorSidebar from "./components/layout/DoctorSidebar";
import { getPrescriptionById } from "../../api/prescription.api";
import { formatUTCDate } from "../../utils/dateUtils";
import PrescriptionDetailModal from "../prescription/modal/PrescriptionDetailModal";
import Toast from "../../components/modals/Toast";

const DoctorPrescriptionViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    useEffect(() => {
        fetchPrescription();
    }, [id]);

    const fetchPrescription = async () => {
        try {
            setLoading(true);
            const res = await getPrescriptionById(id);
            const data = res.data || res;
            setPrescription(data);
        } catch (err) {
            console.error("Lỗi khi tải đơn thuốc:", err);
            setToast({
                show: true,
                message: "Không thể tải thông tin đơn thuốc",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <RoleBasedLayout>
                <DoctorHeader />
                <div className="flex h-[calc(100vh-80px)]">
                    <DoctorSidebar />
                    <main className="flex-1 p-8 overflow-auto bg-gray-50 flex items-center justify-center">
                        <div className="text-gray-500">Đang tải...</div>
                    </main>
                </div>
            </RoleBasedLayout>
        );
    }

    if (!prescription) {
        return (
            <RoleBasedLayout>
                <DoctorHeader />
                <div className="flex h-[calc(100vh-80px)]">
                    <DoctorSidebar />
                    <main className="flex-1 p-8 overflow-auto bg-gray-50 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-gray-500 mb-4">Không tìm thấy đơn thuốc</p>
                            <button
                                onClick={() => navigate("/doctor/prescription")}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Quay lại danh sách
                            </button>
                        </div>
                    </main>
                </div>
            </RoleBasedLayout>
        );
    }

    return (
        <RoleBasedLayout>
            <DoctorHeader />
            <div className="flex h-[calc(100vh-80px)]">
                <DoctorSidebar />
                <main className="flex-1 p-8 overflow-auto bg-gray-50">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">
                                Chi tiết đơn thuốc
                            </h1>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Xem đơn in
                                </button>
                                <button
                                    onClick={() => navigate(`/doctor/prescription/${id}/edit`)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => navigate("/doctor/prescription")}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                >
                                    Quay lại
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6 space-y-6">
                            {/* Thông tin cơ bản */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    Thông tin đơn thuốc
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Mã đơn
                                        </label>
                                        <p className="text-gray-900">{prescription.id}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Ngày tạo
                                        </label>
                                        <p className="text-gray-900">
                                            {formatUTCDate(
                                                prescription.created_at,
                                                "DD/MM/YYYY HH:mm"
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Tổng tiền
                                        </label>
                                        <p className="text-gray-900 font-semibold">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(prescription.total_fee || 0)}
                                        </p>
                                    </div>
                                    {prescription.return_date && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">
                                                Ngày tái khám
                                            </label>
                                            <p className="text-gray-900">
                                                {formatUTCDate(
                                                    prescription.return_date,
                                                    "DD/MM/YYYY"
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Thông tin bệnh nhân */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    Thông tin bệnh nhân
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Họ và tên
                                        </label>
                                        <p className="text-gray-900">
                                            {prescription.patient?.patient_full_name || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Số điện thoại
                                        </label>
                                        <p className="text-gray-900">
                                            {prescription.patient?.patient_phone || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Kết luận */}
                            {prescription.conclusion && (
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                        Kết luận
                                    </h2>
                                    <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                                        {prescription.conclusion}
                                    </p>
                                </div>
                            )}

                            {/* Danh sách thuốc */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    Danh sách thuốc
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border px-4 py-2 text-left">
                                                    STT
                                                </th>
                                                <th className="border px-4 py-2 text-left">
                                                    Tên thuốc
                                                </th>
                                                <th className="border px-4 py-2 text-left">
                                                    Số lượng
                                                </th>
                                                <th className="border px-4 py-2 text-left">
                                                    Đơn vị
                                                </th>
                                                <th className="border px-4 py-2 text-left">
                                                    Liều dùng
                                                </th>
                                                <th className="border px-4 py-2 text-left">
                                                    Giá
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(prescription.details || []).map((detail, idx) => (
                                                <tr key={detail.id} className="hover:bg-gray-50">
                                                    <td className="border px-4 py-2 text-center">
                                                        {idx + 1}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {detail.medicine?.name || "N/A"}
                                                    </td>
                                                    <td className="border px-4 py-2 text-center">
                                                        {detail.quantity}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {detail.medicine?.unit || "N/A"}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {detail.dosage || "--"}
                                                    </td>
                                                    <td className="border px-4 py-2">
                                                        {new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }).format(
                                                            (detail.medicine?.price || 0) *
                                                                detail.quantity
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {showModal && prescription && (
                <PrescriptionDetailModal
                    prescription={prescription}
                    onClose={() => setShowModal(false)}
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

export default DoctorPrescriptionViewPage;

