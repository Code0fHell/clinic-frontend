import React, { useState } from "react";
import PrescriptionInfoForm from "./form/PrescriptionInfoForm";
import PrescriptionMedicineSelector from "./selector/PrescriptionMedicineSelector";
import PrescriptionDetailTable from "./table/PrescriptionDetailTable";
import PrescriptionDetailModal from "./modal/PrescriptionDetailModal";
import Toast from "../../components/modals/Toast";
import {
    createPrescription,
    getPrescriptionById,
} from "../../api/prescription.api";

const PrescriptionPage = ({ visit }) => {
    const patient = visit?.patient || {};
    const doctor = visit?.doctor || {};

    const [conclusion, setConclusion] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [selectedMedicines, setSelectedMedicines] = useState([]);
    const [prescriptionId, setPrescriptionId] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [createdPrescription, setCreatedPrescription] = useState(null);
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    // Add medicine to local list
    const handleAddMedicine = (medicine) => {
        if (!selectedMedicines.find((m) => m.id === medicine.id)) {
            setSelectedMedicines([
                ...selectedMedicines,
                { ...medicine, quantity: 1, dosage: "" },
            ]);
        }
    };

    // Remove medicine from local list
    const handleRemoveMedicine = (id) => {
        setSelectedMedicines(selectedMedicines.filter((m) => m.id !== id));
    };

    // Update quantity/dosage in local list
    const handleQuantityChange = (id, quantity) => {
        setSelectedMedicines(
            selectedMedicines.map((m) => (m.id === id ? { ...m, quantity } : m))
        );
    };
    const handleDosageChange = (id, dosage) => {
        setSelectedMedicines(
            selectedMedicines.map((m) => (m.id === id ? { ...m, dosage } : m))
        );
    };

    // Create prescription and details
    const handleCreatePrescription = async () => {
        if (!conclusion.trim()) {
            setToast({
                show: true,
                message: "Vui lòng nhập kết luận.",
                type: "info",
            });
            return;
        }
        if (selectedMedicines.length === 0) {
            setToast({
                show: true,
                message: "Vui lòng chọn ít nhất 1 thuốc.",
                type: "info",
            });
            return;
        }
        if (!returnDate) {
            setToast({
                show: true,
                message: "Vui lòng chọn ngày tái khám.",
                type: "info",
            });
            return;
        }
        try {
            // Build medicine_items array
            const medicine_items = selectedMedicines.map((m) => ({
                medicine_id: m.id,
                quantity: m.quantity,
                dosage: m.dosage || "",
            }));

            // Only send fields backend expects
            const dto = {
                patient_id: patient.id,
                doctor_id: doctor.id,
                conclusion,
                return_date: returnDate,
                medicine_items,
            };

            // Create prescription with all medicines
            const res = await createPrescription(dto);
            
            // Handle response - backend returns { message, prescription_id, data }
            const prescriptionData = res.data || res;
            const newPrescriptionId = res.prescription_id || prescriptionData?.id;
            
            if (!newPrescriptionId) {
                throw new Error("Không nhận được ID đơn thuốc từ server");
            }

            setPrescriptionId(newPrescriptionId);

            // Use the prescription data from response or fetch it
            const prescriptionToShow = prescriptionData || await getPrescriptionById(newPrescriptionId).then(r => r.data);
            
            setCreatedPrescription({
                ...prescriptionToShow,
                patient: prescriptionToShow.patient || patient,
                doctor: prescriptionToShow.doctor || doctor,
                return_date: prescriptionToShow.return_date || returnDate,
            });
            setShowDetail(true);
            setToast({
                show: true,
                message: res.message || "Tạo đơn thuốc thành công!",
                type: "success",
            });
        } catch (err) {
            setToast({
                show: true,
                message: "Tạo đơn thuốc thất bại!",
                type: "error",
            });
        }
    };

    return (
        <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
            <div className="max-w-[1800px] mx-auto space-y-4">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-3 bg-white rounded-xl shadow-lg px-5 py-3 border border-slate-200">
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <h1 className="text-xl font-bold text-slate-800">Kê Đơn Thuốc</h1>
                            <p className="text-xs text-slate-500">Tạo đơn thuốc cho bệnh nhân</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    {/* Patient Info Section */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4">
                        <PrescriptionInfoForm
                            patient={patient}
                            conclusion={conclusion}
                            setConclusion={setConclusion}
                            disabled={!!prescriptionId}
                        />
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Medicine Search and Return Date in Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <PrescriptionMedicineSelector onSelect={handleAddMedicine} />
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Ngày tái khám <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="date"
                                        value={returnDate}
                                        onChange={(e) => setReturnDate(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Selected Medicines Table */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base font-semibold text-slate-800">
                                    Danh sách thuốc đã chọn
                                </h3>
                                {selectedMedicines.length > 0 && (
                                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                        {selectedMedicines.length} thuốc
                                    </span>
                                )}
                            </div>
                            <PrescriptionDetailTable
                                medicines={selectedMedicines.map((m) => ({
                                    id: m.id,
                                    medicine: m,
                                    quantity: m.quantity,
                                    dosage: m.dosage,
                                }))}
                                onRemove={handleRemoveMedicine}
                                onQuantityChange={handleQuantityChange}
                                onDosageChange={handleDosageChange}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-3 border-t border-slate-200">
                            <button
                                onClick={handleCreatePrescription}
                                disabled={selectedMedicines.length === 0 || !conclusion.trim() || !returnDate}
                                className={`flex-1 py-2.5 px-6 rounded-lg font-medium transition-all duration-200 ${
                                    selectedMedicines.length && conclusion.trim() && returnDate
                                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-200"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Tạo đơn thuốc
                                </div>
                            </button>
                        </div>

                        {(!selectedMedicines.length || !conclusion.trim() || !returnDate) && (
                            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span>
                                    {!conclusion.trim() && !selectedMedicines.length && !returnDate && "Vui lòng nhập kết luận, chọn thuốc và ngày tái khám"}
                                    {!conclusion.trim() && selectedMedicines.length > 0 && returnDate && "Vui lòng nhập kết luận khám bệnh"}
                                    {conclusion.trim() && !selectedMedicines.length && returnDate && "Vui lòng chọn ít nhất 1 thuốc"}
                                    {conclusion.trim() && selectedMedicines.length > 0 && !returnDate && "Vui lòng chọn ngày tái khám"}
                                    {!conclusion.trim() && !selectedMedicines.length && returnDate && "Vui lòng nhập kết luận và chọn ít nhất 1 thuốc"}
                                    {!conclusion.trim() && selectedMedicines.length > 0 && !returnDate && "Vui lòng nhập kết luận và chọn ngày tái khám"}
                                    {conclusion.trim() && !selectedMedicines.length && !returnDate && "Vui lòng chọn thuốc và ngày tái khám"}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showDetail && createdPrescription && (
                <PrescriptionDetailModal
                    prescription={createdPrescription}
                    onClose={() => setShowDetail(false)}
                />
            )}

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </div>
    );
};

export default PrescriptionPage;
