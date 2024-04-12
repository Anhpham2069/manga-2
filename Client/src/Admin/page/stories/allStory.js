import { Space, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { getAllHistory, getNumberSaveStory, getStoriesByList } from "../../../services/apiStoriesRequest";
import { Select } from "antd";
import { render } from "react-dom";

const apiURLOTruyen = process.env.API_URL;
const view = 100;

const AllStory = () => {

  const [readHistory, setReadHistory] = useState();
  const [saveStory,setSaveStory] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllHistory()
        if (res) {
          setReadHistory(res);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getNumberSaveStory()
        if (res) {
          setSaveStory(res);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  
  const columns = [
    //   {
    //     title: "Ảnh",
    //     dataIndex: "name",
    //     key: "name",
    //     render: () => <div>
    //             <img src="">
    //          </div>
    //   },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => {
        const date = new Date(text);
        return (
          <span>{`${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`}</span>
        );
      },
    },
    {
      title: "Tags",
      key: "status",
      dataIndex: "status",
    },
    {
      title: "Lượt xem",
      key: "view",
      render: (slug) =>{
        <>
          {slug.slug}
        </>

      }
    },
  ];
  const [stories, setStories] = useState();
  const [list, setList] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStoriesByList(list);
        if (res.data) setStories(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [list]);
  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setList(value);
  };
  console.log(stories);
  return (
    <div>
      <Select
        className="w-full mb-5 h-11 text-3xl font-semibold"
        defaultValue="truyen-moi"
        // style={{
        //   width: ,
        // }}
        onChange={handleChange}
        options={[
          {
            value: "truyen-moi",
            label: "Truyện mới",
          },
          {
            value: "sap-ra-mat",
            label: "Săp ra mắt",
          },
          {
            value: "dang-phat-hanh",
            label: "Đang phát hành",
          },
          {
            value: "hoan-thanh",
            label: "Hoàn thành",
          },
        ]}
      />
      <Table columns={columns} dataSource={stories?.items} />
    </div>
  );
};

export default AllStory;
