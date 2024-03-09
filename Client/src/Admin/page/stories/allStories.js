import React, { useState, useRef, useEffect } from "react";
import { Table, Button, Modal, message, Input, Upload, Tag, Space } from "antd";
import {
  PlusCircleOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import Search from "antd/es/input/Search";
import { Data } from "../../../services/Data";
import UpdateStory from "./updateStory";
import AddStory from "./AddStory";
import { deleteStoryById, getAllStories, setStories } from "../../../redux/slice/storiesSlice";
import { set } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { deleteStoryApi,getAllStoriesApi } from "./fetchApi";
import UpdateChapter from "./updateChapter";

const { Column } = Table;
const { confirm } = Modal;

const apiURL = process.env.REACT_APP_API_URL;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const AllStories = () => {
  const dispatch = useDispatch()
  const stories = useSelector((state) => state.stories.stories);
  // const [stories,setStories] = useState([])
  
  // const { stories } = data
  
  console.log(stories)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalUpdateChap, setIsModalUpdateChap] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const [selectedStory, setSelectedStory] = useState(null);
  const searchInput = useRef(null);

  const getColumnSearchProps = (dataIndex, customFilterFn) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput.current = node;
          }}
          placeholder={`Tìm kiếm ${dataIndex.toLowerCase()}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="dashed"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, }}
          >
            Tìm kiếm
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
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
            ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
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

  const updateChapterOk = () => {
    setIsModalUpdateChap(false);
  };

  const updateChapterCancel = () => {
    setIsModalUpdateChap(false);
  };

  const showModal = (record) => {
    setIsModalOpen(true);
    setSelectedStory(record)
  };

  const showModalUpdateChap = (record) => {
    setIsModalUpdateChap(true);
    setSelectedStory(record)
  };

  const showDeleteConfirm = (sId) => {
    confirm({
      title: "Bạn chắc chắn muốn xóa sản phẩm này chứ",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        deleteStoryApi(sId)
          .then((response) => {
            console.log('API Response:', response);
            dispatch(deleteStoryById(sId));
            message.success("Xóa sản phẩm thành công!");
          })
          .catch((error) => {
            console.error('API Error:', error);
            message.error("Xóa sản phẩm không thành công!");
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const props = {
    name: "file",
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  // fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllStoriesApi();
        if (res && res.data) {
          console.log('API Response:', res);
          dispatch(setStories(res.data))
          // setStories(res.data);
        }
        console.log(res);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Xử lý lỗi nếu cần
      }
    };

    fetchData();
  }, [setStories]); 
  
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên",
      dataIndex: "sTitle",
      key: "sTitle",
      ...getColumnSearchProps("sTitle"),
      sorter: (a, b) => a.sTitle.length - b.sTitle.length,
      sortDirections: ["descend"],
    },
    {
      title: "Thể loại",
      dataIndex: "sGenres",
      key: "sGenres",
      render: (genres) => (
        <span>
          {genres?.map((genre, index) => (
            <span key={index}>
              {console.log(genre)}
              {genre}
              {index < genres.length - 1 && <span>, </span>}
            </span>
          ))}
        </span>
      ),
      // ...getColumnSearchProps("genres", (value, record) =>
      //   record.genres.some((genre) => genre.toLowerCase().includes(value.toLowerCase()))
      // ),
      filters: [
        { text: "Action", value: "Action" },
        { text: "Racing", value: "Racing" },
      ],
      onFilter: (value, record) => record.genres.indexOf(value) === 0,
    },
    
    {
      title: "Ngày thêm",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.date_added) - new Date(b.date_added),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) => new Date(a.date_added) - new Date(b.date_added),
    },
    {
      title: "Số Chap",
      render: (record) => record.sChapter.length,
      key: "id",
    },
    {
      title: "Trạng thái",
      dataIndex : "sStatus",
      key: "sStatus",
      render: (record) => (
        <Space>
          {record === "Hoàn thành" ? (
            <Tag color="red">Hoàn thành</Tag> 
          ) : record === "Sắp bắt đầu" ? (
            <Tag color="yellow">Sắp bắt đầu</Tag>
          ) : record === "Đang cập nhật" ? (
            <Tag color="blue">Đang cập nhật</Tag>
          ):""}
        </Space>
      ),
      filters: [
        { text: "Sắp bắt đầu", value: "Sắp bắt đầu" },
        { text: "Đang cập nhật", value: "Đang cập nhật" },
        { text: "Hoàn thành", value: "Hoàn thành" },
        { text: "Tất cả", value: "all" }
      ],
      onFilter: (value, record) => {
        if (value === "all") {
          return true; // Return true for all records when the filter value is "all"
        }
        return record.status && record.status.indexOf(value) === 0;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (record) => (
        <Space size="large">
          <Button onClick={() => showModal(record)}> Cập nhật</Button>
          <Modal
            title="Cập nhật Truyện"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <UpdateStory story={selectedStory} id={record._id}/>
          </Modal>

          <Button type="primary" ghost onClick={() => showModalUpdateChap(record)}>
            + Chap mới
          </Button>
          <Modal
            open={isModalUpdateChap}
            onOk={updateChapterOk}
            onCancel={updateChapterCancel}
            width={1000}
          >
            <label className="font-bold text-primary-color text-2xl  uppercase">Quản lý các chap </label>
            <UpdateChapter storyId={record._id} chapter={selectedStory?.sChapter}/>
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
          <PlusCircleOutlined /> Thêm truyện mới
        </Button>
        <Modal
          title="Truyện mới"
          open={isModalAddOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={1000}
        >
          <AddStory />
        </Modal>

        {/* <Search
          className=""
          placeholder="Tìm truyện..."
          onSearch={onSearch}
        /> */}
      </div>
      <Table dataSource={stories} columns={columns} onChange={onChange} />
    </div>
  );
};

export default AllStories;
