import { Table, Space, Button, Modal, message, Input, Upload } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { getAllCategory } from "../../../services/apiStoriesRequest";

const GenreAdmin = () => {
  const [genres, setGenres] = useState([]);
  console.log(genres);

  useEffect(() => {
    // setGenres(getAllCategory())
    const fetchDataGenres = async () => {
      try {
        const res = await getAllCategory();
        if (res) {
          setGenres(res);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDataGenres();
  }, []);

  const column = [
    // {
    //   title: "STT",
    //   dataIndex: "Index",
    //   key: "Index",
    // },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
  ];
  return (
    <div>
      <Table dataSource={genres?.items} columns={column} />
    </div>
  );
};

export default GenreAdmin;
