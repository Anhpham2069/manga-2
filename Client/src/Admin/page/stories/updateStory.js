import { Form, Input, Button, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import Typography from "antd/es/typography/Typography";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStory } from "./fetchApi"; // Assuming you have an updateStory function
import { Select as AntSelect } from "antd";
import { updateStoryById } from "../../../redux/slice/storiesSlice";

const UpdateStory = ({ story }) => {
  const dispatch = useDispatch();
  const genres = useSelector((state) => state.genres);

  console.log(story._id);
  const [storyUpdate, setStoryUpdate] = useState({
    sTitle: story.sTitle,
    sGenre: story.sGenres,
    chapters: story.sChapter,
    sDetails: story.sDescription,
    sAuthor: story.sAuthor,
    sHashtag: story.sHashtag,
    sStatus: story.sStatus,
  });
  useEffect(() => {
    // Update the state when the story prop changes
    setStoryUpdate({
      sTitle: story.sTitle,
      sGenre: story.sGenres,
      chapters: story.sChapter,
      sDetails: story.sDescription,
      sAuthor: story.sAuthor,
      sHashtag: story.sHashtag,
      sStatus: story.sStatus,
    });
  }, [story]);
  const handleChapterChange = (event) => {
    // Similar logic for handling chapter changes as in AddStoryForm
  };

  const handleDeleteChapter = (chapterName) => {
    // Similar logic for deleting chapters as in AddStoryForm
  };

  const handleFormChange = (value, field) => {
    setStoryUpdate((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = async () => {
    console.log("Submitted:", storyUpdate);
    try {
      const res = await updateStory(story._id, storyUpdate); // Assuming you have an updateStory API call
      console.log(res);
      if (res) {
        dispatch(updateStoryById({ ...story, ...storyUpdate }));
        message.success("Cập nhật truyện thành công");
      }
    } catch (error) {
      console.log(error);
      if (error) {
        message.error("Cập nhật truyện không thành công");
      }
    }
  };

  return (
    <Form onFinish={handleSubmit} autoComplete="off">
      <Form.Item label="Tên tuyện">
        <Input
          placeholder=""
          value={storyUpdate.sTitle}
          onChange={(e) => handleFormChange(e.target.value, "sTitle")}
        />
      </Form.Item>

      <Form.Item label="Thể loại">
        <AntSelect
          placeholder=""
          value={storyUpdate.sGenre}
          onChange={(value) => handleFormChange(value, "sGenre")}
          mode="multiple"
        >
          {genres.map((genre) => (
            <AntSelect.Option key={genre._id} value={genre.genreName}>
              {genre.genreName}
            </AntSelect.Option>
          ))}
        </AntSelect>
      </Form.Item>
      <Form.Item label="Chi tiết truyện">
        <Input
          placeholder=""
          value={storyUpdate.sDetails}
          onChange={(e) => handleFormChange(e.target.value, "sDetails")}
        />
      </Form.Item>

      <Form.Item label="Tác giả">
        <Input
          placeholder=""
          value={storyUpdate.sAuthor}
          onChange={(e) => handleFormChange(e.target.value, "sAuthor")}
        />
      </Form.Item>

      <Form.Item label="Hashtag">
        <Input
          placeholder=""
          value={storyUpdate.sHashtag}
          onChange={(e) => handleFormChange(e.target.value, "sHashtag")}
        />
      </Form.Item>

      <Form.Item label="Trạng thái">
        <AntSelect
          defaultValue={storyUpdate.sStatus}
          // style={{ width: 470 }}
          onChange={(value) => handleFormChange(value, "sStatus")}
          options={[
            { value: "Sắp bắt đầu", label: "Sắp bắt đầu" },
            { value: "Đang cập nhật", label: "Đang cập nhật" },
            { value: "Hoàn thành", label: "Hoàn thành" },
          ]}
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          className="bg-primary-color text-white"
          htmlType="submit"
        >
          Cập nhật truyện
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateStory;
