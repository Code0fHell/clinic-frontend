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
                return_date: returnDate || null,
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
        <div className="p-4 bg-gray-50">
            <h1 className="text-2xl font-bold text-blue-700 text-center mb-4">
                Kê Đơn Thuốc
            </h1>
            <div className="bg-white rounded-lg shadow-md p-5 space-y-4">
                <PrescriptionInfoForm
                    patient={patient}
                    conclusion={conclusion}
                    setConclusion={setConclusion}
                    disabled={!!prescriptionId}
                />

                <PrescriptionMedicineSelector onSelect={handleAddMedicine} />

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

                <div className="text-right mt-4">
                    <button
                        onClick={handleCreatePrescription}
                        disabled={selectedMedicines.length === 0 || !conclusion}
                        className={`px-4 py-2 rounded-lg text-white ${
                            selectedMedicines.length && conclusion
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        Tạo đơn thuốc
                    </button>
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
