import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../../components/layout/RoleBasedLayout";
import DoctorHeader from "../components/layout/DoctorHeader";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import Toast from "../../../components/modals/Toast";
import { formatUTCDate } from "../../../utils/dateUtils";

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

    // State cho các trường nhập kết quả
    const [formData, setFormData] = useState({
        result: "",
        conclusion: "",
        testResults: indication?.serviceItems?.map(item => ({
            serviceId: item.id,
            serviceName: item.medical_service.name,
            result: "",
            normalRange: "",
            unit: "",
        })) || [],
    });

    const handleInputChange = (index, field, value) => {
        const newTestResults = [...formData.testResults];
        newTestResults[index][field] = value;
        setFormData({ ...formData, testResults: newTestResults });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        const hasEmptyResults = formData.testResults.some(test => !test.result);
        if (hasEmptyResults) {
            setToast({
                show: true,
                message: "Vui lòng nhập đầy đủ kết quả xét nghiệm",
                type: "error",
            });
            return;
        }

        if (!formData.conclusion) {
            setToast({
                show: true,
                message: "Vui lòng nhập kết luận",
                type: "error",
            });
            return;
        }

        setLoading(true);
        try {
            // TODO: tạo api save lab test result
            // await saveLabTestResult({ indicationId: id, ...formData });
            
            // fake api call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setToast({
                show: true,
                message: "Lưu kết quả xét nghiệm thành công",
                type: "success",
            });

            // chuyển hướng đến trang kết quả đã xử lý sau 1.5s
            setTimeout(() => {
                navigate("/lab/completed-results");
            }, 1500);
        } catch (error) {
            console.error("Lỗi khi lưu kết quả xét nghiệm:", error);
            setToast({
                show: true,
                message: "Lỗi khi lưu kết quả xét nghiệm",
                type: "error",
            });
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
                                <div className="space-y-6">
                                    {formData.testResults.map((test, index) => (
                                        <div key={test.serviceId} className="border border-gray-200 rounded-lg p-4">
                                            <h3 className="font-medium text-gray-800 mb-3">
                                                {index + 1}. {test.serviceName}
                                            </h3>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Kết quả <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={test.result}
                                                        onChange={(e) => handleInputChange(index, "result", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Nhập kết quả"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Đơn vị
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={test.unit}
                                                        onChange={(e) => handleInputChange(index, "unit", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="VD: mg/dL, g/L"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Giá trị tham chiếu
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={test.normalRange}
                                                        onChange={(e) => handleInputChange(index, "normalRange", e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="VD: 70-110"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Kết luận */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    Kết luận <span className="text-red-500">*</span>
                                </h2>
                                <textarea
                                    value={formData.conclusion}
                                    onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                    placeholder="Nhập kết luận về kết quả xét nghiệm..."
                                    required
                                />
                            </div>

                            {/* Nút lưu */}
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate("/lab/indications")}
                                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
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

