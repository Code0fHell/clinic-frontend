import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile, updatePatientProfile, getMedicalRecords } from "../../api/profile.api";
import AvatarEdit from "../../components/forms/AvatarEdit";
import UserInfoForm from "../../components/forms/UserInfoForm";
import PatientInfoForm from "../../components/forms/PatientInfoForm";
import MedicalRecordTabs from "../../components/tables/MedicalRecordTabs";
import Toast from "../../components/modals/Toast";
import RoleBasedLayout from "../../components/layout/RoleBasedLayout";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [patient, setPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState({ indications: [], prescriptions: [] });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
        setPatient(data.patient);
      } catch (err) {
        setToast({ message: "Không thể tải thông tin hồ sơ.", type: "error" });
      }
    };
    const fetchRecords = async () => {
      try {
        const records = await getMedicalRecords();
        setMedicalRecords({
          indications: records.indication_tickets,
          prescriptions: records.prescriptions,
        });
      } catch (err) {}
    };
    fetchProfile();
    fetchRecords();
  }, []);

  const handleUserUpdate = async (values) => {
    try {
      await updateUserProfile(values);
      setToast({ message: "Cập nhật thông tin người dùng thành công.", type: "success" });
    } catch (err) {
      setToast({ message: "Cập nhật thất bại.", type: "error" });
    }
  };

  const handlePatientUpdate = async (values) => {
    try {
      await updatePatientProfile(patient.id, values);
      setToast({ message: "Cập nhật thông tin bệnh nhân thành công.", type: "success" });

      setPatient({ ...patient, ...values });
    } catch (err) {
      setToast({ message: "Cập nhật thất bại.", type: "error" });
    }
  };


  return (
    <RoleBasedLayout>
      <div className="bg-[#f7f7f9] min-h-screen py-10">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg px-10 py-10">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <AvatarEdit user={user} onUpdate={setUser} showToast={(msg, type) => setToast({ message: msg, type })}/>
            <div className="mt-4 text-center">
              <div className="text-xl font-semibold">{user?.full_name}</div>
              <div className="text-gray-500">{user?.email}</div>
            </div>
          </div>
          {/* Info */}
          <div className="border-t pt-8">
            <UserInfoForm user={user} onSubmit={handleUserUpdate} />
          </div>
          <div className="border-t pt-8">
            <PatientInfoForm patient={patient} onSubmit={handlePatientUpdate} />
          </div>
          {/* Medical Records */}
          <div className="border-t pt-8 mt-8">
            <MedicalRecordTabs
              indications={medicalRecords.indications}
              prescriptions={medicalRecords.prescriptions}
            />
          </div>
        </div>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </div>
    </RoleBasedLayout>
  );
};

export default ProfilePage;