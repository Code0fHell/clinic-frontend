import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RoleBasedLayout from "../../components/layout/RoleBasedLayout";
import DoctorHeader from "./components/layout/DoctorHeader";
import DoctorSidebar from "./components/layout/DoctorSidebar";
import PrescriptionInfoForm from "../prescription/form/PrescriptionInfoForm";
import PrescriptionMedicineSelector from "../prescription/selector/PrescriptionMedicineSelector";
import PrescriptionDetailTable from "../prescription/table/PrescriptionDetailTable";
import Toast from "../../components/modals/Toast";
import {
    getPrescriptionById,
    updatePrescription,
} from "../../api/prescription.api";
import {
    getPrescriptionDetails,
    createPrescriptionDetail,
    updatePrescriptionDetail,
    deletePrescriptionDetail,
} from "../../api/prescription-detail.api";

const DoctorPrescriptionEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [prescription, setPrescription] = useState(null);
    const [conclusion, setConclusion] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [selectedMedicines, setSelectedMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
            setConclusion(data.conclusion || "");
            setReturnDate(
                data.return_date
                    ? new Date(data.return_date).toISOString().split("T")[0]
                    : ""
            );

            // Load prescription details
            try {
                const detailsRes = await getPrescriptionDetails(id);
                const details = detailsRes.data || detailsRes;
                const medicines = Array.isArray(details)
                    ? details.map((d) => ({
                          id: d.medicine?.id,
                          medicine: d.medicine,
                          quantity: d.quantity,
                          dosage: d.dosage || "",
                          detailId: d.id, // Keep track of detail ID for updates
                      }))
                    : [];
                setSelectedMedicines(medicines);
            } catch (err) {
                // If no details found, that's okay - start with empty list
                console.log("No prescription details found or error loading:", err);
                setSelectedMedicines([]);
            }
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

    const handleAddMedicine = (medicine) => {
        if (!selectedMedicines.find((m) => m.id === medicine.id)) {
            setSelectedMedicines([
                ...selectedMedicines,
                { ...medicine, quantity: 1, dosage: "", detailId: null },
            ]);
        }
    };

    const handleRemoveMedicine = (medicineId) => {
        const medicine = selectedMedicines.find((m) => m.id === medicineId);
        // If it has a detailId, we need to delete it from backend
        if (medicine?.detailId) {
            deletePrescriptionDetail(medicine.detailId).catch((err) => {
                console.error("Lỗi khi xóa thuốc:", err);
            });
        }
        setSelectedMedicines(
            selectedMedicines.filter((m) => m.id !== medicineId)
        );
    };

    const handleQuantityChange = (medicineId, quantity) => {
        setSelectedMedicines(
            selectedMedicines.map((m) =>
                m.id === medicineId ? { ...m, quantity } : m
            )
        );
    };

    const handleDosageChange = (medicineId, dosage) => {
        setSelectedMedicines(
            selectedMedicines.map((m) =>
                m.id === medicineId ? { ...m, dosage } : m
            )
        );
    };

    const handleSave = async () => {
        if (!conclusion.trim()) {
            setToast({
                show: true,
                message: "Vui lòng nhập kết luận.",
                type: "info",
            });
            return;
        }

        try {
            setSaving(true);

            // Update prescription basic info
            const updateDto = {
                conclusion,
                return_date: returnDate || null,
            };
            await updatePrescription(id, updateDto);

            // Update or create prescription details
            for (const medicine of selectedMedicines) {
                const detailDto = {
                    medicine_id: medicine.id,
                    quantity: medicine.quantity,
                    dosage: medicine.dosage || "",
                };

                if (medicine.detailId) {
                    // Update existing detail
                    await updatePrescriptionDetail(medicine.detailId, detailDto);
                } else {
                    // Create new detail
                    await createPrescriptionDetail({
                        prescription_id: id,
                        ...detailDto,
                    });
                }
            }

            setToast({
                show: true,
                message: "Cập nhật đơn thuốc thành công!",
                type: "success",
            });

            // Navigate back to view page after a short delay
            setTimeout(() => {
                navigate(`/doctor/prescription/${id}`);
            }, 1500);
        } catch (err) {
            console.error("Lỗi khi cập nhật đơn thuốc:", err);
            setToast({
                show: true,
                message: "Cập nhật đơn thuốc thất bại!",
                type: "error",
            });
        } finally {
            setSaving(false);
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
                                Chỉnh sửa đơn thuốc
                            </h1>
                            <button
                                onClick={() => navigate(`/doctor/prescription/${id}`)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                Hủy
                            </button>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-5 space-y-4">
                            <PrescriptionInfoForm
                                patient={prescription.patient}
                                conclusion={conclusion}
                                setConclusion={setConclusion}
                                disabled={false}
                            />

                            <PrescriptionMedicineSelector
                                onSelect={handleAddMedicine}
                            />

                            <PrescriptionDetailTable
                                medicines={selectedMedicines.map((m) => ({
                                    id: m.id,
                                    medicine: m.medicine || m,
                                    quantity: m.quantity,
                                    dosage: m.dosage,
                                }))}
                                onRemove={handleRemoveMedicine}
                                onQuantityChange={handleQuantityChange}
                                onDosageChange={handleDosageChange}
                            />

                            <div className="flex gap-4 items-center">
                                <label className="text-gray-700 font-medium">
                                    Ngày tái khám
                                </label>
                                <input
                                    type="date"
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    className="border rounded-lg px-3 py-2 shadow-sm focus:ring focus:ring-blue-200"
                                />
                            </div>

                            <div className="flex gap-4 justify-end mt-6">
                                <button
                                    onClick={() => navigate(`/doctor/prescription/${id}`)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving || selectedMedicines.length === 0 || !conclusion}
                                    className={`px-4 py-2 rounded-lg text-white ${
                                        saving ||
                                        selectedMedicines.length === 0 ||
                                        !conclusion
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-green-600 hover:bg-green-700"
                                    }`}
                                >
                                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                            </div>
                        </div>
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

export default DoctorPrescriptionEditPage;

