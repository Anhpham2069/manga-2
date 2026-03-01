import React, { useState, useEffect } from "react";
import {
  SaveOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Button, Table, Tag, Modal, Input, Switch, message, Space, Tooltip } from "antd";
import {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncement,
} from "./fetchApi";

const { TextArea } = Input;

const AdminNotificationForm = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: "", message: "" });

  // Fetch all announcements
  const fetchAnnouncements = async () => {
    setLoading(true);
    const data = await getAllAnnouncements();
    setAnnouncements(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Open modal for create
  const handleCreate = () => {
    setEditingId(null);
    setFormData({ title: "", message: "" });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleEdit = (record) => {
    setEditingId(record._id);
    setFormData({ title: record.title || "", message: record.message });
    setIsModalOpen(true);
  };

  // Submit form (create or update)
  const handleSubmit = async () => {
    if (!formData.message.trim()) {
      message.error("Vui lòng nhập nội dung thông báo!");
      return;
    }

    if (editingId) {
      const updated = await updateAnnouncement(editingId, formData);
      if (updated) {
        message.success("Đã cập nhật thông báo!");
      }
    } else {
      const created = await createAnnouncement(formData);
      if (created) {
        message.success("Đã tạo thông báo mới!");
      }
    }

    setIsModalOpen(false);
    setFormData({ title: "", message: "" });
    setEditingId(null);
    fetchAnnouncements();
  };

  // Delete
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa thông báo này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        await deleteAnnouncement(id);
        message.success("Đã xóa thông báo!");
        fetchAnnouncements();
      },
    });
  };

  // Toggle active
  const handleToggle = async (id) => {
    await toggleAnnouncement(id);
    fetchAnnouncements();
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => text || <span className="text-gray-400 italic">Không có tiêu đề</span>,
    },
    {
      title: "Nội dung",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
      width: "35%",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 130,
      render: (isActive, record) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={isActive}
            onChange={() => handleToggle(record._id)}
            checkedChildren={<CheckCircleOutlined />}
            unCheckedChildren={<CloseCircleOutlined />}
          />
          <Tag color={isActive ? "green" : "default"}>
            {isActive ? "Hiển thị" : "Ẩn"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date) =>
        new Date(date).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-blue-500 hover:text-blue-700"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(record._id)}
              danger
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <NotificationOutlined className="text-blue-500" />
          Quản lý thông báo
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleCreate}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Tạo thông báo
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={announcements}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        locale={{ emptyText: "Chưa có thông báo nào" }}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={
          <span className="text-lg font-semibold">
            {editingId ? "Sửa thông báo" : "Tạo thông báo mới"}
          </span>
        }
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          setFormData({ title: "", message: "" });
          setEditingId(null);
        }}
        okText={editingId ? "Cập nhật" : "Tạo"}
        cancelText="Hủy"
        width={600}
      >
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tiêu đề (không bắt buộc)
          </label>
          <Input
            placeholder="Nhập tiêu đề thông báo..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            size="large"
            className="mb-4"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nội dung thông báo <span className="text-red-500">*</span>
          </label>
          <TextArea
            placeholder="Nhập nội dung thông báo sẽ hiển thị cho người dùng..."
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            rows={4}
            showCount
            maxLength={500}
            className="mb-2"
          />
        </div>
      </Modal>
    </div>
  );
};

export default AdminNotificationForm;
