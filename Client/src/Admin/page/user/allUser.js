import { Table, Space, Modal, message, Button } from "antd";
import React, { useEffect, useState } from "react";
import { deleteUser, getAllUser } from "./fetchApi";
import { useDispatch, useSelector } from "react-redux";
const { confirm } = Modal;
const AllUser = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);

  const userList = useSelector((state) => state.user.users?.allUsers);
  const accessToken = user?.accessToken;
  const id = user?.id

  useEffect(() => {
    if (user.accessToken) getAllUser(dispatch, accessToken);
  }, []);
  console.log(userList)
  const handleDelete = (id) => {
    deleteUser( id,accessToken, dispatch);
  };
  const showDeleteConfirm = (id) => {
    confirm({
      title: "Bạn chắc chắn muốn xóa sản phẩm này chứ",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        deleteUser( id,accessToken, dispatch);
        message.success("Xóa sản phẩm thành công!");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Ngày thêm",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt) => {
        const date = new Date(updatedAt);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        return <span>{formattedDate}</span>;
      },
    },
    
    {
      title: "Hành động ",
      dataIndex: "address",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* <a>Cập nhật</a> */}
          <Button onClick={()=>showDeleteConfirm(record._id)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={userList} columns={columns} />;
    </div>
  );
};

export default AllUser;
