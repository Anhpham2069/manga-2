import React, { useEffect, useState } from "react";
import { Avatar, List } from "antd";
import { getAllErorr } from "../../../services/apiStoriesRequest";
const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
];
const ErrComponent = () => {
  const [isErorr, setIsErorr] = useState();

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
  console.log(isErorr);
  return (
    <div className="bg-white p-5 shadow-md">
      {" "}
      <List
        itemLayout="horizontal"
        dataSource={isErorr}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <a key="list-loadmore-edit">edit</a>,
              <a key="list-loadmore-more">Xóa</a>,
            ]}
          >
            <List.Item.Meta
              className="text-lg"
              avatar={
                <div className="flex flex-col items-center">
                  <Avatar
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                  />
                  <p className=" font-light text-sm">{item.userName}</p>
                </div>
              }
              title={
                <>
                  {" "}
                  <a href="https://ant.design">Tên truyện: {item.storyInfo}</a>
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
