import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../../components/layout/RoleBasedLayout";
import DoctorHeader from "../components/layout/DoctorHeader";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import Toast from "../../../components/modals/Toast";
import { formatUTCDate } from "../../../utils/dateUtils";
import { createLabTestResult } from "../../../api/lab-test-result.api";

const LabTestResultPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const indication = location.state?.indication;

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    // State cho các trường nhập kết quả
    const [formData, setFormData] = useState({
        conclusion: "",
        testResults: indication?.serviceItems?.map(item => ({
            serviceIndicationId: item.id,
            serviceName: item.medical_service.service_name,
            referenceValue: item.medical_service.reference_value,
            result: "",
        })) || [],
    });

    const handleInputChange = (index, value) => {
        const newTestResults = [...formData.testResults];
        newTestResults[index].result = value;
        setFormData({ ...formData, testResults: newTestResults });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        const hasEmptyResults = formData.testResults.some(test => !test.result);
        if (hasEmptyResults) {
            showToast("Vui lòng nhập đầy đủ kết quả xét nghiệm", "error");
            return;
        }

        if (!formData.conclusion) {
            showToast("Vui lòng nhập kết luận", "error");
            return;
        }

        // Validate số
        const invalidResults = formData.testResults.filter(test => {
            const numValue = parseFloat(test.result);
            return isNaN(numValue);
        });

        if (invalidResults.length > 0) {
            showToast("Kết quả xét nghiệm phải là số hợp lệ", "error");
            return;
        }

        setLoading(true);
        try {
            // Prepare payload
            const payload = {
                indication_id: indication.id,
                patient_id: indication.patient.id,
                service_results: formData.testResults.map(test => ({
                    service_indication_id: test.serviceIndicationId,
                    test_result: parseFloat(test.result),
                })),
                conclusion: formData.conclusion,
            };

            await createLabTestResult(payload);

            showToast("Lưu kết quả xét nghiệm thành công", "success");

            // Chuyển hướng đến trang danh sách kết quả đã hoàn thành sau 1.5s
            setTimeout(() => {
                navigate("/lab/completed-results");
            }, 1500);
        } catch (error) {
            console.error("Lỗi khi lưu kết quả xét nghiệm:", error);
            const message = error.response?.data?.message || "Lỗi khi lưu kết quả xét nghiệm";
            showToast(message, "error");
        } finally {
            setLoading(false);
        }
    };

    if (!indication) {
        return (
            <RoleBasedLayout>
                <DoctorHeader />
                <div className="flex h-[calc(100vh-80px)]">
                    <DoctorSidebar />
                    <main className="flex-1 p-8 overflow-auto bg-gray-50 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-gray-500 mb-4">Không tìm thấy thông tin phiếu chỉ định</p>
                            <button
                                onClick={() => navigate("/lab/indications")}
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
                    <div className="max-w-5xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">
                                Nhập kết quả xét nghiệm
                            </h1>
                            <button
                                onClick={() => navigate("/lab/indications")}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                Quay lại
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Thông tin bệnh nhân */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    Thông tin bệnh nhân
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Mã phiếu
                                        </label>
                                        <p className="text-gray-900 font-medium">
                                            {indication.barcode || indication.id}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Ngày chỉ định
                                        </label>
                                        <p className="text-gray-900">
                                            {formatUTCDate(indication.indication_date, "DD/MM/YYYY HH:mm")}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Họ và tên
                                        </label>
                                        <p className="text-gray-900 font-medium">
                                            {indication.patient?.patient_full_name}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Ngày sinh
                                        </label>
                                        <p className="text-gray-900">
                                            {formatUTCDate(indication.patient?.patient_dob, "DD/MM/YYYY")}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Giới tính
                                        </label>
                                        <p className="text-gray-900">
                                            {indication.patient?.patient_gender}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Số điện thoại
                                        </label>
                                        <p className="text-gray-900">
                                            {indication.patient?.patient_phone}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-gray-600">
                                            Địa chỉ
                                        </label>
                                        <p className="text-gray-900">
                                            {indication.patient?.patient_address}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin bác sĩ chỉ định */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    Thông tin bác sĩ chỉ định
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Bác sĩ
                                        </label>
                                        <p className="text-gray-900 font-medium">
                                            {indication.doctor?.user?.full_name}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-gray-600">
                                            Chẩn đoán
                                        </label>
                                        <p className="text-gray-900 bg-gray-50 p-3 rounded">
                                            {indication.diagnosis}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Danh sách dịch vụ và nhập kết quả */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    Kết quả xét nghiệm
                                </h2>
                                <div className="space-y-4">
                                    {formData.testResults.map((test, index) => (
                                        <div key={test.serviceIndicationId} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-medium text-gray-800">
                                                    {index + 1}. {test.serviceName}
                                                </h3>
                                                {test.referenceValue && (
                                                    <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                                                        Giá trị tham chiếu: <span className="font-semibold text-blue-600">{test.referenceValue}</span>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Kết quả đo được <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={test.result}
                                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Nhập kết quả (số)"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex items-end">
                                                    {test.referenceValue && test.result && (
                                                        <div className="text-sm">
                                                            {parseFloat(test.result) > test.referenceValue ? (
                                                                <span className="text-red-600 font-medium">⬆ Cao hơn tham chiếu</span>
                                                            ) : parseFloat(test.result) < test.referenceValue ? (
                                                                <span className="text-orange-600 font-medium">⬇ Thấp hơn tham chiếu</span>
                                                            ) : (
                                                                <span className="text-green-600 font-medium">✓ Bình thường</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Kết luận */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    Kết luận tổng quát <span className="text-red-500">*</span>
                                </h2>
                                <textarea
                                    value={formData.conclusion}
                                    onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                    placeholder="Nhập kết luận tổng quát về kết quả xét nghiệm của bệnh nhân..."
                                    required
                                />
                            </div>

                            {/* Nút lưu */}
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate("/lab/indications")}
                                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                    disabled={loading}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-6 py-2 rounded-lg ${
                                        loading
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700"
                                    } text-white`}
                                >
                                    {loading ? "Đang lưu..." : "Lưu kết quả"}
                                </button>
                            </div>
                        </form>
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

export default LabTestResultPage;
