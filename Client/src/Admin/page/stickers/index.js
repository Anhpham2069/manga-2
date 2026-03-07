import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Input, message, Upload } from "antd";
import { UploadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../../../components/layout/DarkModeSlice";

const StickerAdmin = () => {
    const [stickers, setStickers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();

    const isDarkModeEnable = useSelector(selectDarkMode);
    const user = useSelector((state) => state?.auth.login.currentUser);

    const fetchStickers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/stickers/all`);
            setStickers(res.data);
        } catch (error) {
            console.error("Error fetching stickers", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStickers();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/stickers/delete/${id}`, {
                headers: { token: `Bearer ${user?.accessToken}` }
            });
            message.success("Đã xóa danh mục sticker!");
            fetchStickers();
        } catch (error) {
            message.error("Xóa thất bại!");
        }
    };

    const handleUploadAndSave = async (values) => {
        try {
            if (fileList.length === 0) {
                // Just upsert category
                await axios.post(`${process.env.REACT_APP_API_URL}/api/stickers/upsert`, values, {
                    headers: { token: `Bearer ${user?.accessToken}` }
                });
            } else {
                // Upload files
                const formData = new FormData();
                formData.append("category", values.category);
                formData.append("label", values.label);
                fileList.forEach(file => {
                    formData.append("files", file.originFileObj);
                });
                await axios.post(`${process.env.REACT_APP_API_URL}/api/stickers/upload`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        token: `Bearer ${user?.accessToken}`
                    }
                });
            }
            message.success("Lưu dữ liệu thành công!");
            setIsModalVisible(false);
            form.resetFields();
            setFileList([]);
            fetchStickers();
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi lưu.");
        }
    };

    const columns = [
        {
            title: "Mã Danh Mục (Category)",
            dataIndex: "category",
            key: "category",
        },
        {
            title: "Tên Hiển Thị (Label)",
            dataIndex: "label",
            key: "label",
        },
        {
            title: "Số Lượng Ảnh",
            key: "count",
            render: (_, record) => <span>{record.stickers?.length || 0}</span>
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            form.setFieldsValue({ category: record.category, label: record.label });
                            setIsModalVisible(true);
                        }}
                    >
                        Thêm ảnh
                    </Button>
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)}>
                        Xóa
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className={`p-6 md:p-8 rounded-xl min-h-screen ${isDarkModeEnable ? "bg-[#1e293b]" : "bg-white"}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className={`text-2xl font-bold ${isDarkModeEnable ? "text-white" : "text-gray-800"}`}>
                        Quản Lý Stickers (Meme)
                    </h2>
                    <p className={isDarkModeEnable ? "text-gray-400" : "text-gray-500"}>
                        Thêm mới và tải lên các ảnh sticker động vào hệ thống
                    </p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsModalVisible(true)}
                >
                    Thêm Gói Sticker
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={stickers}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 800 }}
            />

            <Modal
                title="Thêm Gói Sticker"
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                    setFileList([]);
                }}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleUploadAndSave}>
                    <Form.Item
                        name="category"
                        label="Mã danh mục (vd: mrdien, tonton)"
                        rules={[{ required: true, message: "Vui lòng nhập mã danh mục!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="label"
                        label="Tên hiển thị (vd: Mr Điên, Tôn Tôn)"
                        rules={[{ required: true, message: "Vui lòng nhập tên hiển thị!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Chọn tệp ảnh (.gif, .png)">
                        <Upload
                            multiple
                            beforeUpload={() => false} // manual upload
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />}>Chọn nhiều thư mục / Ảnh</Button>
                        </Upload>
                    </Form.Item>

                    <div className="flex justify-end mt-6">
                        <Button className="mr-2" onClick={() => setIsModalVisible(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit">Lưu Gói Sticker</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default StickerAdmin;
