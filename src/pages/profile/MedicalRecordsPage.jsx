import React, { useEffect, useState } from "react";
import { getMedicalRecords } from "../../api/profile.api";
import MedicalRecordTabs from "../../components/tables/MedicalRecordTabs";
import Toast from "../../components/modals/Toast";
import RoleBasedLayout from "../../components/layout/RoleBasedLayout";

const MedicalRecordsPage = () => {
  const [medicalRecords, setMedicalRecords] = useState({ indications: [], prescriptions: [] });
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
        });
      } catch (err) {
        setToast({ message: "Không thể tải hồ sơ bệnh án.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);
  console.log(medicalRecords);
  return (
    <RoleBasedLayout>
      <div className="bg-[#f7f7f9] min-h-screen py-10">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg px-10 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Hồ sơ bệnh án</h1>
            <p className="text-gray-600">Xem lịch sử khám bệnh, đơn thuốc và phiếu chỉ định của bạn</p>
          </div>

          {/* Medical Records */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-500">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div>
              <MedicalRecordTabs
                indications={medicalRecords.indications}
                prescriptions={medicalRecords.prescriptions}
              />
              {medicalRecords.indications.length === 0 && medicalRecords.prescriptions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-2">📋</div>
                  <p>Chưa có hồ sơ bệnh án nào</p>
                </div>
              )}
            </div>
          )}
        </div>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </div>
    </RoleBasedLayout>
  );
};

export default MedicalRecordsPage;

