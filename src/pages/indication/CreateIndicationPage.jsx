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
  const [indicationType, setIndicationType] = useState("IMAGING"); // IMAGING hoặc TEST
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

  const handleRemoveService = (serviceId) => {
    setSelectedServices(selectedServices.filter((s) => s.id !== serviceId));
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
        indication_type: indicationType, // Thêm loại chỉ định
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <IndicationHeader />
        
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Patient Info Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <PatientInfoCard
              patient={patient}
              diagnosis={diagnosis}
              setDiagnosis={setDiagnosis}
            />
          </div>

          <div className="p-6 space-y-6">
            {/* Indication Type Selector */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Loại chỉ định <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setIndicationType("IMAGING");
                    setSelectedServices([]); // Reset services khi đổi loại
                  }}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    indicationType === "IMAGING"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                      : "bg-white text-slate-600 border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Chỉ định hình ảnh
                  </div>
                </button>
                <button
                  onClick={() => {
                    setIndicationType("TEST");
                    setSelectedServices([]); // Reset services khi đổi loại
                  }}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    indicationType === "TEST"
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105"
                      : "bg-white text-slate-600 border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Chỉ định xét nghiệm
                  </div>
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {indicationType === "IMAGING" 
                  ? "Chọn các dịch vụ chẩn đoán hình ảnh (X-quang, CT, MRI, Siêu âm...)" 
                  : "Chọn các dịch vụ xét nghiệm (Máu, Nước tiểu, Sinh hóa...)"}
              </p>
            </div>

            {/* Service Search */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <ServiceSearchBox 
                onSelect={handleAddService} 
                serviceType={indicationType}
              />
            </div>

            {/* Selected Services Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-800">
                  Danh sách dịch vụ đã chọn
                </h3>
                {selectedServices.length > 0 && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {selectedServices.length} dịch vụ
                  </span>
                )}
              </div>
              <SelectedServiceTable 
                services={selectedServices}
                onRemove={handleRemoveService}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={handleCreateTicket}
                disabled={!selectedServices.length || !diagnosis.trim()}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  selectedServices.length && diagnosis.trim()
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-200"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Tạo phiếu chỉ định
                </div>
              </button>
            </div>

            {(!selectedServices.length || !diagnosis.trim()) && (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>
                  {!diagnosis.trim() && !selectedServices.length && "Vui lòng nhập chẩn đoán và chọn ít nhất 1 dịch vụ"}
                  {!diagnosis.trim() && selectedServices.length > 0 && "Vui lòng nhập chẩn đoán lâm sàng"}
                  {diagnosis.trim() && !selectedServices.length && "Vui lòng chọn ít nhất 1 dịch vụ"}
                </span>
              </div>
            )}
          </div>
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
