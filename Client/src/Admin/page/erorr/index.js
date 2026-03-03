import React, { useEffect, useState } from "react";
import { Avatar, List, Tag, Button, Popconfirm, message, Empty, Spin } from "antd";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  getAllErorr,
  deleteStoryError,
  updateStoryErrorStatus,
} from "../../../services/apiStoriesRequest";

const ErrComponent = () => {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllErorr();
      if (res) setErrors(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Đánh dấu đã sửa
  const handleDone = async (id) => {
    try {
      await updateStoryErrorStatus(id, "done");
      setErrors((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "done" } : item
        )
      );
      message.success("Đã đánh dấu là đã sửa");
    } catch (error) {
      message.error("Cập nhật thất bại");
    }
  };

  // Đánh dấu chưa sửa
  const handlePending = async (id) => {
    try {
      await updateStoryErrorStatus(id, "pending");
      setErrors((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "pending" } : item
        )
      );
      message.info("Đã chuyển về chưa sửa");
    } catch (error) {
      message.error("Cập nhật thất bại");
    }
  };

  // Xóa báo lỗi
  const handleDelete = async (id) => {
    try {
      await deleteStoryError(id);
      setErrors((prev) => prev.filter((item) => item._id !== id));
      message.success("Đã xóa báo lỗi");
    } catch (error) {
      message.error("Xóa thất bại");
    }
  };

  const pendingCount = errors.filter((e) => e.status !== "done").length;
  const doneCount = errors.filter((e) => e.status === "done").length;

  if (loading) {
    return (
      <div className="bg-white p-10 shadow-md flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-white p-3 sm:p-5 shadow-md rounded-xl overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-bold">Quản lý báo lỗi</h2>
        <div className="flex gap-2 sm:gap-3">
          <Tag color="red" className="text-xs sm:text-sm px-2 sm:px-3 py-1">
            Chưa sửa: {pendingCount}
          </Tag>
          <Tag color="green" className="text-xs sm:text-sm px-2 sm:px-3 py-1">
            Đã sửa: {doneCount}
          </Tag>
        </div>
      </div>

      {errors.length === 0 ? (
        <Empty description="Chưa có báo lỗi nào" />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={errors}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                item.status === "done" ? (
                  <Button
                    key="undo"
                    size="small"
                    icon={<ClockCircleOutlined />}
                    onClick={() => handlePending(item._id)}
                  >
                    Hoàn tác
                  </Button>
                ) : (
                  <Button
                    key="done"
                    type="primary"
                    size="small"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleDone(item._id)}
                    className="bg-blue-500"
                  >
                    Đã sửa
                  </Button>
                ),
                <Popconfirm
                  key="delete"
                  title="Xác nhận xóa báo lỗi này?"
                  onConfirm={() => handleDelete(item._id)}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ className: "bg-red-500" }}
                >
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                  >
                    Xóa
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                className="text-lg"
                avatar={
                  <div className="flex flex-col items-center">
                    <Avatar
                      src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                    />
                    <p className="font-light text-sm mt-1">{item.userName}</p>
                  </div>
                }
                title={
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>Truyện: {item.storyInfo}</span>
                    {item.chapterInfo && (
                      <Tag color="blue">Chapter: {item.chapterInfo}</Tag>
                    )}
                    {item.status === "done" ? (
                      <Tag color="green" icon={<CheckCircleOutlined />}>
                        Đã sửa
                      </Tag>
                    ) : (
                      <Tag color="red" icon={<ClockCircleOutlined />}>
                        Chưa sửa
                      </Tag>
                    )}
                  </div>
                }
                description={
                  <div>
                    <p>
                      <span className="font-bold">Nội dung lỗi: </span>
                      {item.nameErr}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.timestamp).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default ErrComponent;
