import axiosClient from "./axiosClient";

export const createMedicalTicket = async (visitId) => {
  const res = await axiosClient.post(`/medical-ticket/create/${visitId}`);
  return res.data;
};

