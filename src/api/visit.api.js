// Tạo phiếu thăm khám
export const createVisit = async (dto) => {
    const res = await axiosClient.post("/visit/create", dto);
    return res.data;
};