import React, { useState } from "react";
import IndicationHeader from "./layout/IndicationHeader";
import PatientInfoCard from "./cards/PatientInfoCard";
import ServiceSearchBox from "./input/ServiceSearchBox";
import SelectedServiceTable from "./table/SelectedServiceTable";
import IndicationDetailModal from "./modal/IndicationDetailModal";
import { createIndicationTicket } from "../../api/indication.api";
import Toast from "../../components/modals/Toast"; 

const CreateIndicationPage = ({ visit }) => {
  const patient = visit?.patient || {};
  const [selectedServices, setSelectedServices] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleAddService = (service) => {
    if (!selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  
  const handleCreateTicket = async () => {
    try {
      const medicalTicket = visit?.medicalTickets?.[0];

      if (!medicalTicket) {
        showToast("Không tìm thấy phiếu khám cho bệnh nhân.", "error");
        return;
      }

      if (!diagnosis.trim()) {
        showToast("Vui lòng nhập chẩn đoán lâm sàng trước khi tạo phiếu.", "info");
        return;
      }

      const payload = {
        patient_id: visit?.patient?.id,
        medical_ticket_id: medicalTicket.id,
        diagnosis,
        medical_service_ids: selectedServices.map((s) => s.id),
      };

      console.log("payload", payload);

      const res = await createIndicationTicket(payload);
      setCreatedTicket(res);
      setShowDetail(true);
      showToast("Tạo phiếu chỉ định thành công!", "success");
    } catch (err) {
      console.error("Lỗi tạo phiếu:", err);
      const msg =
        err.response?.data?.message || "Tạo phiếu chỉ định thất bại. Vui lòng thử lại.";
      showToast(msg, "error");
    }
  };

  return (
    <div className="p-4 bg-gray-50">
      <IndicationHeader />
      <div className="bg-white rounded-lg shadow-md p-5 space-y-4">
        <PatientInfoCard
          patient={patient}
          diagnosis={diagnosis}
          setDiagnosis={setDiagnosis}
        />
        <ServiceSearchBox onSelect={handleAddService} />
        <SelectedServiceTable services={selectedServices} />

        <div className="text-right mt-4">
          <button
            onClick={handleCreateTicket}
            disabled={!selectedServices.length}
            className={`px-4 py-2 rounded-lg text-white ${
              selectedServices.length
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Tạo phiếu chỉ định
          </button>
        </div>
      </div>
      {showDetail && (
        <IndicationDetailModal
          ticket={createdTicket}
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

export default CreateIndicationPage;
