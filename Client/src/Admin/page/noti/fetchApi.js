import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Lấy tất cả thông báo (admin)
export const getAllAnnouncements = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/noti/noti`);
        return res.data;
    } catch (error) {
        console.log(error);
        return [];
    }
};

// Lấy thông báo active (user)
export const getActiveAnnouncement = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/noti/noti/active`);
        return res.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

// Tạo thông báo mới
export const createAnnouncement = async (data) => {
    try {
        const res = await axios.post(`${API_URL}/api/noti/noti`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

// Cập nhật thông báo
export const updateAnnouncement = async (id, data) => {
    try {
        const res = await axios.put(`${API_URL}/api/noti/noti/${id}`, data);
        return res.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

// Xóa thông báo
export const deleteAnnouncement = async (id) => {
    try {
        const res = await axios.delete(`${API_URL}/api/noti/noti/${id}`);
        return res.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

// Bật/tắt trạng thái active
export const toggleAnnouncement = async (id) => {
    try {
        const res = await axios.patch(`${API_URL}/api/noti/noti/${id}/toggle`);
        return res.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};