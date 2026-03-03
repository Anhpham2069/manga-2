import { Table, Tag, Select, Input, Image } from "antd";
import { EyeOutlined, HeartOutlined, BookOutlined, SearchOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { getNumberSaveStory, getStoriesByList } from "../../../services/apiStoriesRequest";
import axios from "axios";
import { Link } from "react-router-dom";

const apiURL = process.env.REACT_APP_API_URL;

const AllStory = () => {
  const [stories, setStories] = useState();
  const [list, setList] = useState("truyen-moi");
  const [saveStory, setSaveStory] = useState({});
  const [viewsMap, setViewsMap] = useState({});
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch stories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getStoriesByList(list);
        if (res?.data) {
          setStories(res.data);

          // Fetch view counts cho tất cả truyện
          const slugs = res.data.items?.map((item) => item.slug) || [];
          if (slugs.length > 0) {
            try {
              const viewsRes = await axios.post(`${apiURL}/api/views/batch`, { slugs });
              setViewsMap(viewsRes.data || {});
            } catch (e) {
              console.log(e);
            }
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [list]);

  // Fetch favorite counts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getNumberSaveStory();
        if (res) setSaveStory(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (value) => {
    setList(value);
  };

  // Filter theo search
  const filteredItems = stories?.items?.filter((item) =>
    item.name?.toLowerCase().includes(searchText.toLowerCase())
  );

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
      title: "Ảnh",
      key: "image",
      width: 70,
      render: (_, record) => (
        <Image
          width={50}
          height={65}
          src={`https://img.otruyenapi.com/uploads/comics/${record.thumb_url}`}
          alt={record.name}
          style={{ objectFit: "cover", borderRadius: 6 }}
          fallback="https://via.placeholder.com/50x65?text=N/A"
        />
      ),
    },
    {
      title: "Tên truyện",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text, record) => (
        <Link
          to={`/detail/${record.slug}`}
          className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
        >
          {text}
        </Link>
      ),
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    {
      title: "Thể loại",
      key: "category",
      width: 200,
      render: (_, record) => (
        <div className="flex flex-wrap gap-1">
          {record.category?.slice(0, 3).map((cat) => (
            <Tag key={cat.slug} color="blue" className="text-xs">
              {cat.name}
            </Tag>
          ))}
          {record.category?.length > 3 && (
            <Tag color="default" className="text-xs">
              +{record.category.length - 3}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Chapters",
      key: "chapters",
      width: 100,
      align: "center",
      render: (_, record) => (
        <span className="flex items-center justify-center gap-1">
          <BookOutlined />
          {record.chaptersLatest?.[0]?.chapter_name || "0"}
        </span>
      ),
      sorter: (a, b) =>
        parseInt(a.chaptersLatest?.[0]?.chapter_name || 0) -
        parseInt(b.chaptersLatest?.[0]?.chapter_name || 0),
    },
    {
      title: "Lượt xem",
      key: "views",
      width: 110,
      align: "center",
      render: (_, record) => {
        const views = viewsMap[record.slug] || 0;
        return (
          <span className="flex items-center justify-center gap-1 text-green-600 font-medium">
            <EyeOutlined />
            {views.toLocaleString()}
          </span>
        );
      },
      sorter: (a, b) => (viewsMap[a.slug] || 0) - (viewsMap[b.slug] || 0),
    },
    {
      title: "Lượt theo dõi",
      key: "favorites",
      width: 120,
      align: "center",
      render: (_, record) => {
        const favCount = saveStory[record.slug] || 0;
        return (
          <span className="flex items-center justify-center gap-1 text-pink-500 font-medium">
            <HeartOutlined />
            {favCount.toLocaleString()}
          </span>
        );
      },
      sorter: (a, b) => (saveStory[a.slug] || 0) - (saveStory[b.slug] || 0),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status) => {
        let color = "default";
        let text = status || "N/A";
        if (status === "ongoing") { color = "blue"; text = "Đang tiến hành"; }
        else if (status === "completed") { color = "green"; text = "Hoàn thành"; }
        else if (status === "coming_soon") { color = "orange"; text = "Sắp ra mắt"; }
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: "Đang tiến hành", value: "ongoing" },
        { text: "Hoàn thành", value: "completed" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 110,
      align: "center",
      render: (text) => {
        if (!text) return "N/A";
        const date = new Date(text);
        return (
          <span className="text-gray-500 text-sm">
            {date.toLocaleDateString("vi-VN")}
          </span>
        );
      },
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-3 sm:p-5 overflow-hidden">
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-bold m-0">Quản lý truyện</h2>
          <Tag color="blue" className="text-sm">
            {filteredItems?.length || 0} truyện
          </Tag>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Tìm truyện..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 sm:flex-none"
            style={{ minWidth: 0, maxWidth: '100%' }}
            allowClear
          />
          <Select
            className="flex-1 sm:flex-none sm:min-w-[180px]"
            value={list}
            onChange={handleChange}
            options={[
              { value: "truyen-moi", label: "📗 Truyện mới" },
              { value: "sap-ra-mat", label: "🆕 Sắp ra mắt" },
              { value: "dang-phat-hanh", label: "📖 Đang phát hành" },
              { value: "hoan-thanh", label: "✅ Hoàn thành" },
            ]}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredItems}
        rowKey={(record) => record._id || record.slug}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / ${total} truyện`,
        }}
        scroll={{ x: 900 }}
        size="middle"
      />
    </div>
  );
};

export default AllStory;
