import React, { useEffect, useState } from "react";
import { Avatar, List, Tag, Button } from "antd";
import { getAllErorr } from "../../../services/apiStoriesRequest";

const ErrComponent = () => {
  const [isErorr, setIsErorr] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllErorr();
        if (res) setIsErorr(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // 👉 cập nhật trạng thái đã sửa
  const handleDone = (id) => {
    const updated = isErorr.map((item) =>
      item._id === id ? { ...item, status: "done" } : item
    );
    setIsErorr(updated);

    // Nếu có API update thì gọi thêm ở đây
    // await updateErrorStatus(id, "done")
  };

  return (
    <div className="bg-white p-5 shadow-md">
      <List
        itemLayout="horizontal"
        dataSource={isErorr}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              item.status !== "done" && (
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleDone(item._id)}
                >
                  Đã check & sửa
                </Button>
              ),
              <a key="delete">Xóa</a>,
            ]}
          >
            <List.Item.Meta
              className="text-lg"
              avatar={
                <div className="flex flex-col items-center">
                  <Avatar
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                  />
                  <p className="font-light text-sm">{item.userName}</p>
                </div>
              }
              title={
                <>
                  Tên truyện: {item.storyInfo}{" "}
                  {item.status === "done" && (
                    <Tag color="green">Đã check & sửa</Tag>
                  )}
                </>
              }
              description={
                <>
                  <span className="font-bold">Báo lỗi: </span>
                  {item.nameErr}
                </>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ErrComponent;
