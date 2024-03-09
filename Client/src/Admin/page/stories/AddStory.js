import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addStoryApi } from './fetchApi';
import { Select, message } from 'antd';
import { addStory } from '../../../redux/slice/storiesSlice';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const AddStoryForm = () => {
  const dispatch = useDispatch();
  const genres = useSelector((state) => state.genres);
  console.log(genres)

  const [story, setStory] = useState({
    sTitle: '',
    sGenres: [],
    sChapter: [],
    sDescription: '',
    sAuthor: '',
    sHashtag: '',
    sStatus: '',
  });
  const handleChapterChange = (event) => {
    const chapterFiles = event.target.files;
    const newChapters = Array.from(chapterFiles).map((file) => ({
      name: file.name,
      image: URL.createObjectURL(file),
      imageFile: file
    }));
    
    setStory((prevStory) => ({ ...prevStory, sChapter: [...prevStory.sChapter, ...newChapters] }));
  };
  const handleDeleteChapter = (chapterName) => {
    setStory((prevStory) => ({
      ...prevStory,
      sChapter: prevStory.sChapter.filter((chapter) => chapter.name !== chapterName),
    }));
  };
  // const handleStatusChange = (event) => {
  //   const statusValue = event.target.value;
  //   setStory((prevStory) => ({ ...prevStory, sStatus: statusValue }));
  // };

  const handleFormChange = (event, field) => {
    const value = event.target ? event.target.value : event;
    setStory((prevStory) => ({ ...prevStory, [field]: value }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Submitted:', story);
  
    try {
      const formData = new FormData();
      formData.append('sTitle', story.sTitle);
      formData.append('sDescription', story.sDescription);
      formData.append('sAuthor', story.sAuthor);
      formData.append('sStatus', story.sStatus);
      // formData.append('sGenres', story.sGenre);


      story.sGenres.forEach((genre, index) => {
        formData.append(`sGenres[${index}]`, genre);
      });
  
  
      // Append chapter files to FormData
      story.sChapter.forEach((chapter, index) => {
        formData.append(`sChapter[${index}][name]`, chapter.name);
        formData.append(`sChapter[${index}][image]`, chapter.imageFile);
      });
      
      const res = await addStoryApi(formData);
      console.log('API Response:', res);
      dispatch(addStory(story));
  
      if (res) {
        message.success('Thêm truyện mới thành công');
      }
    } catch (error) {
      console.log(error);
      if (error) {
        message.error('Thêm truyện không thành công');
      }
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit} enctype="multipart/form-data" className="w-full mx-auto mt-8 p-4 bg-gray-100 rounded-lg">
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-600">Tên tuyện</label>
        <input
          type="text"
          placeholder=""
          onChange={(e) => handleFormChange(e.target.value, 'sTitle')}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-600">Thể loại</label>
        <Select
          onChange={(value) => handleFormChange(value, 'sGenres')}
          className="mt-1 p-2 w-full border rounded-md"
          mode="multiple"
        >
          {/* <option value="">Chọn thể loại</option> */}
          {genres.map((genre) => (
            <Option key={genre._id} value={genre.genreName}>
            {genre.genreName}
          </Option>
          ))}
        </Select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-600">Chapters</label>
        <input
          type="file"
          onChange={handleChapterChange}
          multiple
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      {story.sChapter && story.sChapter.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-600">Selected Chapters</label>
          <ul className='grid grid-cols-3'>
            {story.sChapter?.map((chapter) => (
              <li key={chapter.id} className="mb-2">
                <strong>{chapter.name}</strong>
                
                <button
                  type="button"
                  onClick={() => handleDeleteChapter(chapter.name)}
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
                <br />
                <img src={chapter.image} alt={chapter.name} className="mt-2 w-2/5 " />
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-600">Chi tiết truyện</label>
        <input
          type="text"
          placeholder=""
          onChange={(e) => handleFormChange(e.target.value, 'sDescription')}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-600">Tác giả</label>
        <input
          type="text"
          placeholder=""
          onChange={(e) => handleFormChange(e.target.value, 'sAuthor')}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-600">Hashtag</label>
        <input
          type="text"
          placeholder=""
          onChange={(e) => handleFormChange(e.target.value, 'sHashtag')}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-600">Trạng thái</label>
        <select onChange={(e) => handleFormChange(e.target.value, 'sStatus')} className="mt-1 p-2 w-full border rounded-md">
          <option value="Trạng thái">Trạng thái</option>
          <option value="Sắp bắt đầu">Sắp bắt đầu</option>
          <option value="Đang cập nhật">Đang cập nhật</option>
          <option value="Hoàn thành">Hoàn thành</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
        <UploadOutlined /> Thêm truyện
      </button>
    </form>
  );
};

export default AddStoryForm;
