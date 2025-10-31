import React, { useState } from "react";
import IndicationHeader from "./layout/IndicationHeader";
import PatientInfoCard from "./cards/PatientInfoCard";
import ServiceSearchBox from "./input/ServiceSearchBox";
import SelectedServiceTable from "./table/SelectedServiceTable";
import IndicationDetailModal from "./modal/IndicationDetailModal";
import { createIndicationTicket } from "../../api/indication.api";

const CreateIndicationPage = ({ visit }) => {
  const patient = visit?.patient || {};
  console.log("visit", visit);
  const [selectedServices, setSelectedServices] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);

  const handleAddService = (service) => {
    if (!selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleCreateTicket = async () => {
    try {
        const user = JSON.parse(localStorage.getItem("user")); 
        const currentVisit = patient.visits[0]; // Chọn visit đầu tiên nếu có nhiều
        const medicalTicket = currentVisit.medicalTickets[0];  // Chọn medicalTicket đầu tiên nếu có nhiều

        if (!medicalTicket) {
            alert("Không tìm thấy phiếu khám cho bệnh nhân.");
            return;
        }

        const payload = {
        patient_id: patient.id,
        medical_ticket_id: medicalTicket.id,  // Lấy medical_ticket_id từ mối quan hệ Visit
        diagnosis,
        medical_service_ids: selectedServices.map((s) => s.id),
        };

        const res = await createIndicationTicket(user.userId, payload);
        setCreatedTicket(res);
        setShowDetail(true);
    } catch (err) {
        console.error("Lỗi tạo phiếu:", err);
    }
 };



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <IndicationHeader />
      <div className="bg-white rounded-xl shadow p-6 mt-4">
        <PatientInfoCard patient={patient} diagnosis={diagnosis} setDiagnosis={setDiagnosis} />
        <ServiceSearchBox onSelect={handleAddService} />
        <SelectedServiceTable services={selectedServices} />
        <div className="text-right mt-4">
          <button
            onClick={handleCreateTicket}
            disabled={!selectedServices.length}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Tạo phiếu chỉ định
          </button>
        </div>
      </div>
      {showDetail && (
        <IndicationDetailModal ticket={createdTicket} onClose={() => setShowDetail(false)} />
      )}
    </div>
  );
};

export default CreateIndicationPage;
