import axiosClient from "./axiosClient";

export const createBill = async (dto) => {
  const res = await axiosClient.post("/bill", dto);
  return res.data;
};

