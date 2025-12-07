import axiosClient from "./axiosClient";

export const getPatientHistory = async (patientId) => {
  const res = await axiosClient.get(`/medical-record/patient/${patientId}/history`);
  return res.data;
};

