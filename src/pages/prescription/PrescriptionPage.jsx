import React, { useState } from "react";
import PrescriptionInfoForm from "./form/PrescriptionInfoForm";
import PrescriptionMedicineSelector from "./selector/PrescriptionMedicineSelector";
import PrescriptionDetailTable from "./table/PrescriptionDetailTable";
import PrescriptionDetailModal from "./modal/PrescriptionDetailModal";
import { createPrescription, getPrescriptionById } from "../../api/prescription.api";
import { createPrescriptionDetail, getPrescriptionDetails } from "../../api/prescription-detail.api";
import Toast from "../../components/modals/Toast";

const PrescriptionPage = ({ visit }) => {
  const patient = visit?.patient || {};
  const doctor = visit?.doctor || {};
  const [conclusion, setConclusion] = useState("");
  const [prescriptionId, setPrescriptionId] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [createdPrescription, setCreatedPrescription] = useState(null);
  const [toast, setToast] = useState(null);

  // Bước 1: Tạo đơn thuốc (chỉ thông tin prescription)
  const handleCreatePrescription = async () => {
    try {
      const dto = {
        patient_id: patient.id,
        doctor_id: doctor.id,
        conclusion,
      };
      const result = await createPrescription(dto);
      setPrescriptionId(result.id);
      setToast({ type: "success", message: "Tạo đơn thuốc thành công! Hãy thêm thuốc vào đơn." });
    } catch (err) {
      setToast({ type: "error", message: "Tạo đơn thuốc thất bại!" });
    }
  };

  // Bước 2: Thêm thuốc vào đơn thuốc
  const handleAddMedicine = async (medicine) => {
    if (!prescriptionId) return;
    try {
      const dto = {
        prescription_id: prescriptionId,
        medicine_id: medicine.id,
        quantity: 1,
        dosage: medicine.dosage || "",
      };
      await createPrescriptionDetail(dto);
      setToast({ type: "success", message: "Thêm thuốc thành công!" });
      // Lấy lại danh sách thuốc đã thêm
      const details = await getPrescriptionDetails(prescriptionId);
      setMedicines(details);
    } catch (err) {
      setToast({ type: "error", message: "Thêm thuốc thất bại!" });
    }
  };

  const handleRemoveMedicine = async (detailId) => {
    // Xóa prescription_detail theo id
    // Bạn cần viết API xóa prescription_detail
    // Sau khi xóa, lấy lại danh sách
    setMedicines(medicines.filter((m) => m.id !== detailId));
  };

  const handleQuantityChange = async (detailId, quantity) => {
    // Cập nhật prescription_detail theo id
    setMedicines(medicines.map((m) => m.id === detailId ? { ...m, quantity } : m));
  };

  // Bước 3: Hiển thị đơn thuốc hoàn chỉnh
  const handleShowDetail = async () => {
    const prescription = await getPrescriptionById(prescriptionId);
    const details = await getPrescriptionDetails(prescriptionId);
    setCreatedPrescription({
      ...prescription,
      medicines: details,
      patient,
      doctor,
    });
    setShowDetail(true);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Kê đơn thuốc</h1>
      <PrescriptionInfoForm
        patient={patient}
        conclusion={conclusion}
        setConclusion={setConclusion}
        disabled={!!prescriptionId}
      />
      {!prescriptionId ? (
        <div className="flex justify-end mt-8">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
            onClick={handleCreatePrescription}
            disabled={!conclusion}
          >
            Tạo đơn thuốc
          </button>
        </div>
      ) : (
        <>
          <PrescriptionMedicineSelector onSelect={handleAddMedicine} />
          <PrescriptionDetailTable
            medicines={medicines}
            onRemove={handleRemoveMedicine}
            onQuantityChange={handleQuantityChange}
          />
          <div className="flex justify-end mt-8">
            <button
              className="bg-green-600 text-white px-6 py-2 rounded font-semibold"
              onClick={handleShowDetail}
              disabled={medicines.length === 0}
            >
              Xem đơn thuốc
            </button>
          </div>
        </>
      )}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      {showDetail && createdPrescription && (
        <PrescriptionDetailModal
          prescription={createdPrescription}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
};

export default PrescriptionPage;