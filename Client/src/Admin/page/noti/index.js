import { SaveOutlined } from "@ant-design/icons";
import { Select } from "antd";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";

const AdminNotificationForm = () => {
  const stories = useSelector((state) => state.stories.stories);
  console.log(stories);

  const [formData, setFormData] = useState({
    time: new Date(),
    storyName: "", // Lưu tên truyện thay vì storyId
    chapterName: "",
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, time: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Gửi yêu cầu lên server để lưu thông tin
    fetch("URL_SERVER_API", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Notification data sent successfully:", data);
        // Reset form or perform other actions if needed
        setFormData({
          time: new Date(),
          storyName: "",
          chapterName: "",
        });
      })
      .catch((error) =>
        console.error("Error sending notification data:", error)
      );
  };

  return (
    <form className="max-w-md mx-auto mt-8 p-8 bg-gray-100 rounded-lg shadow-lg">
      <label className="flex flex-col mb-4">
        <span className="text-gray-700">Thời gian ra chap mới:</span>
        <DatePicker
          selected={formData.time}
          onChange={handleDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          className="mt-1 p-2 block w-full rounded-md border border-gray-300"
        />
      </label>
      <label className="block mb-4">
        <span className="text-gray-700">Tên truyện:</span>
        <Select
          onChange={(value) => handleChange("storyName", value)}
          className="mt-1 w-full "
          
        >
          {stories.map((story) => (
            <Select.Option key={story._id} value={story.sTitle}>
              {story.sTitle}
            </Select.Option>
          ))}
        </Select>
      </label>
      <label className="block mb-4">
        <span className="text-gray-700">Tên chap:</span>
        <input
          type="text"
          name="chapterName"
          value={formData.chapterName}
          onChange={(e) => handleChange("chapterName", e.target.value)}
          className="mt-1 p-2 block w-full rounded-md border border-gray-300"
        />
      </label>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
      >
        <SaveOutlined /> Lưu thông báo
      </button>
    </form>
  );
};

export default AdminNotificationForm;
