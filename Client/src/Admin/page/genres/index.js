import { Table, Space, Button, Modal, message, Input, Upload } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Genres } from "../../../services/Data";
// import UpdateStory from "./updateStory";
import Search from "antd/es/input/Search";

import Highlighter from "react-highlight-words";
// import AddStory from "./AddStory";
import {
  FallOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import AddGenreForm from "./addGenre";
import { allGenres, deleteGenre, updateGenre } from "./fetchApi";
import { deleteGenreById, getAllGenre } from "../../../redux/slice/genreSlice";
import UpdateGenre from "./updateGenre";

const { Column } = Table;
const { confirm } = Modal;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const GenreAdmin = () => {
  const dispatch = useDispatch();
  const genres = useSelector((state) => state.genres);
  console.log(genres);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalUpdateChap, setIsModalUpdateChap] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const getColumnSearchProps = (dataIndex, customFilterFn) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput.current = node;
          }}
          placeholder={`Tìm kiếm ${dataIndex.toLowerCase()}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="dashed"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Đặt lại
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: customFilterFn
      ? customFilterFn
      : (value, record) =>
          record[dataIndex]
            ? record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase())
            : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select());
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const showModalAdd = () => {
    setIsModalAddOpen(true);
  };
  const handleOk = () => {
    setIsModalAddOpen(false);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalAddOpen(false);
    setIsModalOpen(false);
  };
  const showModal = (record) => {
    setSelectedGenre(record);
    setIsModalOpen(true);
    // setInputValue(book.name)
  };
  const handleUpdateSuccess = () => {
    setIsModalOpen(false);
    message.success("cập nhật thể loại thành công");
    // Add any additional logic needed after successful update
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Bạn chắc chắn muốn xóa sản phẩm này chứ",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        deleteGenre(id);
        dispatch(deleteGenreById(id));
        message.success("Xóa sản phẩm thành công!");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  //
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  useEffect(() => {
    fetchDataGenre();
  }, [dispatch]);

  const fetchDataGenre = async () => {
    const res = await allGenres();
    dispatch(getAllGenre(res));
  };

  // Your component

  console.log(selectedGenre);
  const column = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên",
      dataIndex: "genreName",
      key: "name",
      sorter: (a, b) => a.id - b.id,
      ...getColumnSearchProps("genreName"),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Space size="large">
          <Button onClick={() => showModal(record)}> Cập nhật</Button>
          <Modal
            title="Cập nhật Thể loại"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
          >
            <UpdateGenre
              genre={selectedGenre}
              onUpdateSuccess={handleUpdateSuccess}
              onCancel={handleCancel}
            />
            {/* <Input value={selectedGenre && selectedGenre.genreName} onChange={(e)=>updateGenre(e.target.value,selectedGenre._id)}></Input> */}
          </Modal>
          <Button danger onClick={() => showDeleteConfirm(record._id)}>
            {" "}
            Xóa{" "}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="my-5 flex items-center  gap-10">
        <Button
          className="flex items-center p-4 bg-primary-color text-white font-bold "
          onClick={showModalAdd}
        >
          <PlusCircleOutlined /> Thêm thể loại
        </Button>
        <Modal
          title="Thể loại mới"
          open={isModalAddOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <AddGenreForm />
        </Modal>

        {/* <Search
          className=""
          placeholder="Tìm thể loại..."
          onSearch={onSearch}
        /> */}
      </div>
      <Table dataSource={genres} columns={column} onChange={onChange} />
    </div>
  );
};

export default GenreAdmin;
