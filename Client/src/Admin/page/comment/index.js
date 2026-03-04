import React, { useEffect, useState } from "react";
import { Table, Tag, Input, Button, Modal, message, Avatar, Tooltip } from "antd";
import {
    SearchOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    CommentOutlined,
    UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../../../components/layout/DarkModeSlice";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const apiURL = process.env.REACT_APP_API_URL;

const CommentManage = () => {
    const isDarkModeEnable = useSelector(selectDarkMode);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiURL}/api/comment/all`);
            setComments(res.data || []);
        } catch (error) {
            console.error(error);
            message.error("Lỗi khi tải bình luận");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleDelete = (id) => {
        Modal.confirm({
            title: "Xoá bình luận",
            icon: <ExclamationCircleOutlined />,
            content: "Bạn có chắc muốn xoá bình luận này?",
            okText: "Xoá",
            okType: "danger",
            cancelText: "Huỷ",
            onOk: async () => {
                try {
                    await axios.delete(`${apiURL}/api/comment/admin/delete/${id}`);
                    message.success("Đã xoá bình luận");
                    fetchComments();
                    setSelectedRowKeys((prev) => prev.filter((k) => k !== id));
                } catch (error) {
                    message.error("Lỗi khi xoá bình luận");
                }
            },
        });
    };

    const handleBulkDelete = () => {
        if (selectedRowKeys.length === 0) return;
        Modal.confirm({
            title: `Xoá ${selectedRowKeys.length} bình luận`,
            icon: <ExclamationCircleOutlined />,
            content: `Bạn có chắc muốn xoá ${selectedRowKeys.length} bình luận đã chọn?`,
            okText: "Xoá tất cả",
            okType: "danger",
            cancelText: "Huỷ",
            onOk: async () => {
                try {
                    await Promise.all(
                        selectedRowKeys.map((id) =>
                            axios.delete(`${apiURL}/api/comment/admin/delete/${id}`)
                        )
                    );
                    message.success(`Đã xoá ${selectedRowKeys.length} bình luận`);
                    setSelectedRowKeys([]);
                    fetchComments();
                } catch (error) {
                    message.error("Lỗi khi xoá bình luận");
                }
            },
        });
    };

    const filteredComments = comments.filter(
        (c) =>
            c.content?.toLowerCase().includes(searchText.toLowerCase()) ||
            c.username?.toLowerCase().includes(searchText.toLowerCase()) ||
            c.storySlug?.toLowerCase().includes(searchText.toLowerCase())
    );

    // Group by story for stats
    const storyCount = [...new Set(comments.map((c) => c.storySlug))].length;

    const columns = [
        {
            title: "#",
            key: "index",
            width: 50,
            render: (_, __, index) => (
                <span className="font-semibold text-gray-400">{index + 1}</span>
            ),
        },
        {
            title: "Người dùng",
            key: "user",
            width: 150,
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    <Avatar
                        size="small"
                        src={record.userId?.avatar}
                        icon={<UserOutlined />}
                    />
                    <span className="font-medium text-sm truncate">
                        {record.username || "Ẩn danh"}
                    </span>
                </div>
            ),
            sorter: (a, b) => (a.username || "").localeCompare(b.username || ""),
        },
        {
            title: "Nội dung",
            dataIndex: "content",
            key: "content",
            ellipsis: true,
            render: (text) => (
                <Tooltip title={text}>
                    <span className="text-sm">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: "Truyện",
            dataIndex: "storySlug",
            key: "storySlug",
            width: 180,
            ellipsis: true,
            render: (slug) => (
                <a
                    href={`/detail/${slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:text-blue-700 hover:underline text-sm"
                >
                    {slug}
                </a>
            ),
            sorter: (a, b) => (a.storySlug || "").localeCompare(b.storySlug || ""),
        },
        {
            title: "Thời gian",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 130,
            align: "center",
            render: (text) => {
                if (!text) return "N/A";
                const timeAgo = formatDistanceToNow(new Date(text), {
                    addSuffix: true,
                    locale: vi,
                });
                return (
                    <Tooltip title={new Date(text).toLocaleString("vi-VN")}>
                        <span className="text-gray-500 text-xs">{timeAgo}</span>
                    </Tooltip>
                );
            },
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            defaultSortOrder: "descend",
        },
        {
            title: "",
            key: "actions",
            width: 60,
            align: "center",
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(record._id);
                    }}
                    size="small"
                />
            ),
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
    };

    return (
        <div
            className={`rounded-xl shadow-md p-3 sm:p-5 transition-colors duration-300 ${isDarkModeEnable ? "bg-[#1e293b] text-gray-200" : "bg-white"
                }`}
        >
            {/* Header */}
            <div className="flex flex-col gap-3 mb-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <h2
                            className={`text-lg sm:text-xl font-bold m-0 flex items-center gap-2 ${isDarkModeEnable ? "text-white" : ""
                                }`}
                        >
                            <CommentOutlined className="text-blue-500" />
                            Quản lý bình luận
                        </h2>
                        <Tag color="blue" className="text-sm">
                            {comments.length} bình luận
                        </Tag>
                        <Tag color="green" className="text-sm">
                            {storyCount} truyện
                        </Tag>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Input
                            placeholder="Tìm bình luận, user, truyện..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                            allowClear
                        />
                    </div>
                </div>

                {/* Bulk actions */}
                {selectedRowKeys.length > 0 && (
                    <div
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg ${isDarkModeEnable ? "bg-[#334155]" : "bg-blue-50"
                            }`}
                    >
                        <span className="text-sm font-medium">
                            Đã chọn {selectedRowKeys.length} bình luận
                        </span>
                        <Button
                            type="primary"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={handleBulkDelete}
                        >
                            Xoá đã chọn
                        </Button>
                        <Button
                            size="small"
                            onClick={() => setSelectedRowKeys([])}
                        >
                            Bỏ chọn
                        </Button>
                    </div>
                )}
            </div>

            {/* Table */}
            <Table
                columns={columns}
                dataSource={filteredComments}
                rowKey={(record) => record._id}
                rowSelection={rowSelection}
                loading={loading}
                pagination={{
                    pageSize: 15,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "15", "30", "50"],
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} / ${total} bình luận`,
                }}
                scroll={{ x: 800 }}
                size="middle"
            />
        </div>
    );
};

export default CommentManage;
