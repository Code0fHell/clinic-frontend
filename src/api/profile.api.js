import axiosClient from "./axiosClient";

export const getUserProfile = () =>
    axiosClient.get("/user/profile").then((res) => res.data);

export const updateUserProfile = (data) =>
    axiosClient.put("/user/profile", data);

export const updatePatientProfile = (id, data) =>
    axiosClient.put(`/patient/${id}`, data);

export const uploadAvatar = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient
        .put("/user/avatar", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data.url);
};

export const getMedicalRecords = () =>
    axiosClient.get(`/medical-record/history`);

export const changePassword = (data) =>
    axiosClient.put("/user/change-password", data);