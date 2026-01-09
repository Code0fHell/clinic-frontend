import React, { useEffect, useState } from "react";
import { getMedicalRecords } from "../../api/profile.api";
import MedicalRecordTabs from "../../components/tables/MedicalRecordTabs";
import Toast from "../../components/modals/Toast";
import RoleBasedLayout from "../../components/layout/RoleBasedLayout";

const MedicalRecordsPage = () => {
    const [medicalRecords, setMedicalRecords] = useState({
        indications: [],
        prescriptions: [],
        labTestResults: [],
        imageResults: [],
    });
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                setLoading(true);
                const records = await getMedicalRecords();
                setMedicalRecords({
                    indications: records.indication_tickets || [],
                    prescriptions: records.prescriptions || [],
                    labTestResults: records.lab_test_results || [],
                    imageResults: records.image_results || [],
                });
            } catch {
                setToast({
                    message: "Không thể tải hồ sơ bệnh án.",
                    type: "error",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, []);

    return (
        <RoleBasedLayout>
            <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 bg-white rounded-2xl shadow-md px-8 py-6 border-l-4 border-blue-600">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">
                                    Hồ sơ bệnh án
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Xem lịch sử khám bệnh, đơn thuốc, phiếu chỉ
                                    định, kết quả xét nghiệm và chẩn đoán hình
                                    ảnh của bạn
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Medical Records */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        {loading ? (
                            <div className="text-center py-16">
                                <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600"></div>
                                <p className="mt-6 text-gray-600 font-medium">
                                    Đang tải dữ liệu...
                                </p>
                            </div>
                        ) : (
                            <div className="p-6">
                                <MedicalRecordTabs
                                    indications={medicalRecords.indications}
                                    prescriptions={medicalRecords.prescriptions}
                                    labTestResults={
                                        medicalRecords.labTestResults
                                    }
                                    imageResults={medicalRecords.imageResults}
                                />
                                {medicalRecords.indications.length === 0 &&
                                    medicalRecords.prescriptions.length === 0 &&
                                    medicalRecords.labTestResults.length ===
                                        0 &&
                                    medicalRecords.imageResults.length ===
                                        0 && (
                                        <div className="text-center py-16 text-gray-500">
                                            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                                <svg
                                                    className="w-10 h-10 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                            </div>
                                            <p className="text-lg font-medium">
                                                Chưa có hồ sơ bệnh án nào
                                            </p>
                                            <p className="text-sm mt-2 text-gray-400">
                                                Hồ sơ của bạn sẽ hiển thị tại
                                                đây sau khi khám bệnh
                                            </p>
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>
                </div>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </RoleBasedLayout>
    );
};

export default MedicalRecordsPage;
