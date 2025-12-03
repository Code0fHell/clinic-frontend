import React, { useState } from "react";
import IndicationDetailModal from "../modals/IndicationDetailModal";
import PrescriptionDetailModal from "../modals/PrescriptionDetailModal";

const MedicalRecordTabs = ({ indications, prescriptions }) => {
  const [tab, setTab] = useState("indication");
  const [selectedIndication, setSelectedIndication] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  return (
    <div>
      <div className="flex gap-8 border-b mb-6">
        <button
          className={`pb-2 px-2 border-b-2 transition font-medium ${
            tab === "indication"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setTab("indication")}
        >
          Phiếu chỉ định
        </button>
        <button
          className={`pb-2 px-2 border-b-2 transition font-medium ${
            tab === "prescription"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setTab("prescription")}
        >
          Đơn thuốc
        </button>
      </div>
      {tab === "indication" ? (
        <div>
          <table className="w-full mb-4 text-sm">
            <thead>
              <tr className="bg-[#f7f7f9] text-gray-700">
                <th className="p-2 font-medium">STT</th>
                <th className="p-2 font-medium">Ngày</th>
                <th className="p-2 font-medium">Bác sĩ</th>
                <th className="p-2 font-medium">Loại chỉ định</th>
                <th className="p-2 font-medium">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {indications.map((ind, idx) => (
                <tr key={ind.id} className="border-b">
                  <td className="p-2 text-center">{idx + 1}</td>
                  <td className="p-2 text-center">{ind.created_at?.slice(0, 10)}</td>
                  <td className="p-2">{ind.doctor_name}</td>
                  <td className="p-2">{ind.type}</td>
                  <td className="p-2 text-center">
                    <button
                      className="text-blue-600 underline"
                      onClick={() => setSelectedIndication(ind)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedIndication && (
            <IndicationDetailModal
              indication={selectedIndication}
              onClose={() => setSelectedIndication(null)}
            />
          )}
        </div>
      ) : (
        <div>
          <table className="w-full mb-4 text-sm">
            <thead>
              <tr className="bg-[#f7f7f9] text-gray-700">
                <th className="p-2 font-medium">STT</th>
                <th className="p-2 font-medium">Ngày kê đơn</th>
                <th className="p-2 font-medium">Bác sĩ</th>
                <th className="p-2 font-medium">Kết luận</th>
                <th className="p-2 font-medium">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((pres, idx) => (
                <tr key={pres.id} className="border-b">
                  <td className="p-2 text-center">{idx + 1}</td>
                  <td className="p-2 text-center">{pres.created_at?.slice(0, 10)}</td>
                  <td className="p-2">{pres.doctor_name}</td>
                  <td className="p-2">{pres.conclusion}</td>
                  <td className="p-2 text-center">
                    <button
                      className="text-blue-600 underline"
                      onClick={() => setSelectedPrescription(pres)}
                    >
                      Xem đơn thuốc
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedPrescription && (
            <PrescriptionDetailModal
              prescription={selectedPrescription}
              onClose={() => setSelectedPrescription(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MedicalRecordTabs;