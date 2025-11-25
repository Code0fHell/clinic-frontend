import axiosClient from "./axiosClient";

export const updatePatientVitals = async (patientId, payload) => {
  const res = await axiosClient.patch(`/patient/${patientId}/vitals`, payload);
  return res.data;
};

