import React, { useState } from "react";
import { updateChapter } from "./fetchApi";

const apiURL = process.env.REACT_APP_API_URL;

const UpdateChapter = ({ storyId, chapter }) => {
  const [newChapter, setNewChapter] = useState(null);
  console.log(newChapter);

  const handleChapterChange = (event) => {
    const chapterFiles = event.target.files;
    const newChapters = Array.from(chapterFiles).map((file) => ({
      name: file.name,
      image: URL.createObjectURL(file),
      imageFile: file,
    }));

    setNewChapter((prevChapters) => (prevChapters || []).concat(newChapters));
  };

  const handleDeleteChapter = (chapterName) => {
    setNewChapter((prevChapters) =>
      prevChapters.filter((chapter) => chapter.name !== chapterName)
    );
  };

  const handleUpdateChapter = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("storyId", storyId);

      newChapter.forEach((chapter, index) => {
        formData.append(
          `sChapter[${index}][image]`,
          chapter.imageFile,
          chapter.name
        );
      });

      console.log(formData);
      //     formData.append('sChapter', newChapter);
      const response = await updateChapter(formData);
      if (response) {
        console.log("Chapter updated successfully", response.data);
      }
    } catch (error) {
      console.error("Error updating chapter", error.response.data);
    }
  };

  return (
    <div>
      <div className="my-15">
        <div className="mt-10">
          <label className="block text-sm font-bold text-gray-600">
            Thêm chap mới
          </label>
          <input
            type="file"
            onChange={handleChapterChange}
            multiple
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        {newChapter?.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-600">
              Chapter được chọn
            </label>
            <ul className="grid grid-cols-3">
              {newChapter?.map((chapter, index) => (
                <li key={index} className="mb-2">
                  <div className="flex items-center">
                    <strong className="mr-2">{chapter.name}</strong>
                    <button
                      type="button"
                      onClick={() => handleDeleteChapter(chapter.name)}
                      className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                  <img
                    src={chapter.image}
                    alt={chapter.name}
                    className="mt-2 w-full"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button
        className="my-10 p-4 bg-primary-color text-white rounded-md w-full text-lg font-semibold hover:bg-regal-blue"
        onClick={handleUpdateChapter}
      >
        update
      </button>
      <div className="grid grid-cols-3 gap-4 mt-5 ">
        {chapter.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-between bg-slate-200 shadow-lg"
          >
            <div className="flex-col">
              <p>Tên chương: </p>
              <p className="text-2xl font-semibold my-4 ">
                {Array.isArray(item) ? item[0].originalname : item.originalname}
              </p>
            </div>

            {/* Kiểm tra và xử lý sChapterImages */}
            {Array.isArray(item) ? (
              item.map((nestedItem, nestedIndex) => (
                <img
                  key={nestedIndex}
                  className="mb-0"
                  src={`${apiURL}/uploads/stories/${nestedItem.sChapterImages}`}
                  alt={nestedItem.name}
                />
              ))
            ) : (
              <img
                className="mb-0"
                src={`${apiURL}/uploads/stories/${item.sChapterImages}`}
                alt={item.name}
              />
            )}
           <button className="bg-red-400 text-white py-3 hover:bg-red-500">Xóa Chapter</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpdateChapter;
