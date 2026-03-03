import {
  Table,
  Space,
  Modal,
  message,
  Button,
  Tag,
  Input,
  Select,
  Popconfirm,
  Form,
  Tooltip,
  Avatar,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  CrownOutlined,
  GoogleOutlined,
  EditOutlined,
  DeleteOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { deleteUser, getAllUser, updateUser, toggleAdmin } from "./fetchApi";
import { useDispatch, useSelector } from "react-redux";

const AllUser = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const userList = useSelector((state) => state.user.users?.allUsers);
  const isFetching = useSelector((state) => state.user.users?.isFetching);
  const accessToken = user?.accessToken;

  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (accessToken) getAllUser(dispatch, accessToken);
  }, []);

  // --- Thống kê ---
  const totalUsers = userList?.length || 0;
  const adminCount = userList?.filter((u) => u.admin)?.length || 0;
  const normalCount = totalUsers - adminCount;
  const googleCount = userList?.filter((u) => u.googleId)?.length || 0;

  // --- Lọc & Tìm kiếm ---
  const filteredUsers = userList
    ?.filter((u) => {
      if (roleFilter === "admin") return u.admin;
      if (roleFilter === "user") return !u.admin;
      return true;
    })
    ?.filter(
      (u) =>
        u.username?.toLowerCase().includes(searchText.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchText.toLowerCase())
    );

  // --- Xóa ---
  const handleDelete = async (id) => {
    try {
      await deleteUser(id, accessToken, dispatch);
      message.success("Xóa người dùng thành công!");
      getAllUser(dispatch, accessToken);
    } catch {
      message.error("Xóa thất bại!");
    }
  };

  // --- Toggle Admin ---
  const handleToggleAdmin = async (record) => {
    try {
      await toggleAdmin(record._id, accessToken, dispatch);
      message.success(
        `Đã ${record.admin ? "gỡ" : "cấp"} quyền Admin cho ${record.username}`
      );
      getAllUser(dispatch, accessToken);
    } catch {
      message.error("Thao tác thất bại!");
    }
  };

  // --- Chỉnh sửa ---
  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      username: record.username,
      email: record.email,
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await updateUser(editingUser._id, values, accessToken, dispatch);
      message.success("Cập nhật thành công!");
      setEditModalVisible(false);
      setEditingUser(null);
      getAllUser(dispatch, accessToken);
    } catch (err) {
      if (err?.response?.data?.message) {
        message.error(err.response.data.message);
      }
    }
  };

  // --- Avatar chữ cái đầu ---
  const getAvatarColor = (name) => {
    const colors = [
      "#f56a00", "#7265e6", "#ffbf00", "#00a2ae",
      "#87d068", "#108ee9", "#f5317f", "#722ed1",
    ];
    const index = (name?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  // --- Columns ---
  const columns = [
    {
      title: "#",
      key: "index",
      width: 50,
      align: "center",
      render: (_, __, index) => (
        <span className="font-semibold text-gray-400">{index + 1}</span>
      ),
    },
    {
      title: "Người dùng",
      key: "user",
      ellipsis: true,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            style={{ backgroundColor: getAvatarColor(record.username) }}
            size={36}
          >
            {record.username?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div>
            <div className="font-semibold text-gray-800">{record.username}</div>
            <div className="text-gray-400 text-xs">{record.email}</div>
          </div>
        </div>
      ),
      sorter: (a, b) => a.username?.localeCompare(b.username),
    },
    {
      title: "Vai trò",
      key: "role",
      width: 120,
      align: "center",
      render: (_, record) =>
        record.admin ? (
          <Tag
            icon={<CrownOutlined />}
            color="gold"
            className="text-sm font-medium"
          >
            Admin
          </Tag>
        ) : (
          <Tag
            icon={<UserOutlined />}
            color="blue"
            className="text-sm font-medium"
          >
            User
          </Tag>
        ),
      filters: [
        { text: "Admin", value: true },
        { text: "User", value: false },
      ],
      onFilter: (value, record) => record.admin === value,
    },
    {
      title: "Đăng nhập",
      key: "loginType",
      width: 110,
      align: "center",
      render: (_, record) =>
        record.googleId ? (
          <Tooltip title="Đăng nhập bằng Google">
            <Tag icon={<GoogleOutlined />} color="red">
              Google
            </Tag>
          </Tooltip>
        ) : (
          <Tag color="default">Email</Tag>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      align: "center",
      render: (createdAt) => {
        if (!createdAt) return "N/A";
        const date = new Date(createdAt);
        return (
          <span className="text-gray-500 text-sm">
            {date.toLocaleDateString("vi-VN")}
          </span>
        );
      },
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Hành động",
      key: "action",
      width: 180,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-blue-500 hover:text-blue-700"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title={record.admin ? "Gỡ quyền Admin" : "Cấp quyền Admin"}>
            <Popconfirm
              title={`${record.admin ? "Gỡ" : "Cấp"} quyền Admin cho ${record.username}?`}
              onConfirm={() => handleToggleAdmin(record)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="text"
                icon={<SafetyCertificateOutlined />}
                className={
                  record.admin
                    ? "text-yellow-500 hover:text-yellow-700"
                    : "text-gray-400 hover:text-yellow-500"
                }
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title={`Xóa người dùng "${record.username}"?`}
              description="Hành động này không thể hoàn tác!"
              onConfirm={() => handleDelete(record._id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // --- Stats cards ---
  const stats = [
    {
      label: "Tổng người dùng",
      value: totalUsers,
      color: "#1890ff",
      icon: <TeamOutlined />,
    },
    {
      label: "Admin",
      value: adminCount,
      color: "#faad14",
      icon: <CrownOutlined />,
    },
    {
      label: "User thường",
      value: normalCount,
      color: "#52c41a",
      icon: <UserOutlined />,
    },
    {
      label: "Google Login",
      value: googleCount,
      color: "#ff4d4f",
      icon: <GoogleOutlined />,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-3 sm:p-5 overflow-hidden">
      {/* Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
            style={{
              background: `${stat.color}10`,
              border: `1px solid ${stat.color}30`,
            }}
          >
            <div
              className="text-xl sm:text-2xl rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0"
              style={{ color: stat.color, background: `${stat.color}20` }}
            >
              {stat.icon}
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-gray-500 text-[10px] sm:text-xs">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-bold m-0">Quản lý người dùng</h2>
          <Tag color="blue" className="text-sm">
            {filteredUsers?.length || 0} người dùng
          </Tag>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Tìm theo tên, email..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 sm:flex-none"
            style={{ minWidth: 0, maxWidth: '100%' }}
            allowClear
          />
          <Select
            className="flex-1 sm:flex-none sm:min-w-[160px]"
            value={roleFilter}
            onChange={setRoleFilter}
            options={[
              { value: "all", label: "👥 Tất cả" },
              { value: "admin", label: "👑 Admin" },
              { value: "user", label: "👤 User thường" },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey={(record) => record._id}
        loading={isFetching}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / ${total} người dùng`,
        }}
        scroll={{ x: 800 }}
        size="middle"
      />

      {/* Edit Modal */}
      <Modal
        title={
          <span>
            <EditOutlined className="mr-2" />
            Chỉnh sửa người dùng
          </span>
        }
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingUser(null);
        }}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            label="Tên người dùng"
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên người dùng!" },
              { max: 20, message: "Tên tối đa 20 ký tự!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên người dùng" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input prefix="@" placeholder="Email" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AllUser;
