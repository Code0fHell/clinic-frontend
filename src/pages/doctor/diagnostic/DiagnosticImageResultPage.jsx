import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../../components/layout/RoleBasedLayout";
import DoctorHeader from "../components/layout/DoctorHeader";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import Toast from "../../../components/modals/Toast";
import { formatUTCDate } from "../../../utils/dateUtils";
import {
    getDiagnosticIndicationDetail,
    createImageResult,
} from "../../../api/imaging.api";

const DiagnosticImageResultPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const indicationFromState = location.state?.indication;

    const [indication, setIndication] = useState(indicationFromState);
    const [loading, setLoading] = useState(!indicationFromState);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    // Fetch indication detail if not in state
    useEffect(() => {
        if (!indicationFromState && id) {
            const fetchIndication = async () => {
                try {
                    setLoading(true);
                    const data = await getDiagnosticIndicationDetail(id);
                    setIndication(data);
                } catch (error) {
                    console.error("Lỗi khi tải chi tiết chỉ định:", error);
                    setToast({
                        show: true,
                        message:
                            error?.message ||
                            "Không thể tải thông tin chỉ định",
                        type: "error",
                    });
                } finally {
                    setLoading(false);
                }
            };
            fetchIndication();
        }
    }, [id, indicationFromState]);

    // State cho form và ảnh
    const [formData, setFormData] = useState({
        conclusion: "",
        description: "",
        images: [],
    });

    const [imagePreviews, setImagePreviews] = useState([]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        // Validate file types
        const validTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
        ];
        const invalidFiles = files.filter(
            (file) => !validTypes.includes(file.type)
        );

        if (invalidFiles.length > 0) {
            setToast({
                show: true,
                message: "Vui lòng chỉ tải lên file ảnh (JPG, PNG, GIF)",
                type: "error",
            });
            return;
        }

        // Validate file size (max 5MB per file)
        const maxSize = 5 * 1024 * 1024;
        const oversizedFiles = files.filter((file) => file.size > maxSize);

        if (oversizedFiles.length > 0) {
            setToast({
                show: true,
                message: "Kích thước ảnh không được vượt quá 5MB",
                type: "error",
            });
            return;
        }

        // Add new images
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...files],
        }));

        // Create previews
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [
                    ...prev,
                    {
                        file: file,
                        preview: reader.result,
                    },
                ]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (formData.images.length === 0) {
            setToast({
                show: true,
                message: "Vui lòng tải lên ít nhất một ảnh chẩn đoán",
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

        if (!id && !indication?.id) {
            setToast({
                show: true,
                message: "Không tìm thấy ID chỉ định",
                type: "error",
            });
            return;
        }

        setLoading(true);
        try {
            const indicationId = id || indication.id;
            const formDataToSend = new FormData();
            formDataToSend.append("indication_id", indicationId);
            formDataToSend.append("conclusion", formData.conclusion);
            if (formData.description) {
                formDataToSend.append("description", formData.description);
                formDataToSend.append("result", formData.description);
            }

            // Append all image files
            formData.images.forEach((image) => {
                formDataToSend.append("image_files", image);
            });

            await createImageResult(formDataToSend);

            setToast({
                show: true,
                message: "Lưu kết quả chẩn đoán hình ảnh thành công",
                type: "success",
            });

            // chuyển hướng đến trang kết quả đã xử lý sau 1.5s
            setTimeout(() => {
                navigate("/diagnostic/completed-results");
            }, 1500);
        } catch (error) {
            console.error("Lỗi khi lưu kết quả chẩn đoán hình ảnh:", error);
            setToast({
                show: true,
                message:
                    error?.message || "Lỗi khi lưu kết quả chẩn đoán hình ảnh",
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
                            <p className="text-gray-500 mb-4">
                                Không tìm thấy thông tin phiếu chỉ định
                            </p>
                            <button
                                onClick={() =>
                                    navigate("/diagnostic/indications")
                                }
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
                                Nhập kết quả chẩn đoán hình ảnh
                            </h1>
                            <button
                                onClick={() =>
                                    navigate("/diagnostic/indications")
                                }
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
                                            {indication.barcode ||
                                                indication.id}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Ngày chỉ định
                                        </label>
                                        <p className="text-gray-900">
                                            {formatUTCDate(
                                                indication.indication_date,
                                                "DD/MM/YYYY HH:mm"
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Họ và tên
                                        </label>
                                        <p className="text-gray-900 font-medium">
                                            {
                                                indication.patient
                                                    ?.patient_full_name
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Ngày sinh
                                        </label>
                                        <p className="text-gray-900">
                                            {formatUTCDate(
                                                indication.patient?.patient_dob,
                                                "DD/MM/YYYY"
                                            )}
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
                                            {
                                                indication.patient
                                                    ?.patient_address
                                            }
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

                            {/* Danh sách dịch vụ */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    Dịch vụ chẩn đoán
                                </h2>
                                <div className="space-y-2">
                                    {indication.serviceItems?.map(
                                        (item, index) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                            >
                                                <span className="font-medium text-gray-700">
                                                    {index + 1}.
                                                </span>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800">
                                                        {
                                                            item.medical_service
                                                                .name
                                                        }
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {
                                                            item.medical_service
                                                                .description
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Upload ảnh */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    Tải lên hình ảnh chẩn đoán{" "}
                                    <span className="text-red-500">*</span>
                                </h2>

                                {/* Upload button */}
                                <div className="mb-4">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg
                                                className="w-10 h-10 mb-3 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                />
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">
                                                    Click để tải ảnh lên
                                                </span>{" "}
                                                hoặc kéo thả
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, GIF (tối đa 5MB mỗi
                                                ảnh)
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                </div>

                                {/* Image previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {imagePreviews.map((item, index) => (
                                            <div
                                                key={index}
                                                className="relative group"
                                            >
                                                <img
                                                    src={item.preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveImage(index)
                                                    }
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                                <p className="text-xs text-gray-600 mt-1 truncate">
                                                    {item.file.name}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Mô tả chi tiết */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    Mô tả chi tiết
                                </h2>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                    placeholder="Nhập mô tả chi tiết về hình ảnh chẩn đoán..."
                                />
                            </div>

                            {/* Kết luận */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    Kết luận{" "}
                                    <span className="text-red-500">*</span>
                                </h2>
                                <textarea
                                    value={formData.conclusion}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            conclusion: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                    placeholder="Nhập kết luận về kết quả chẩn đoán hình ảnh..."
                                    required
                                />
                            </div>

                            {/* Nút lưu */}
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/diagnostic/indications")
                                    }
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

export default DiagnosticImageResultPage;
