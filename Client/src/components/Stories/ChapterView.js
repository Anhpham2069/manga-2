import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faCircleInfo,
  faHeart,
  faHome,
  faArrowRight,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import NavBar from "../layout/Navbar";
import Footer from "../layout/footer";

import { useSelector } from "react-redux";
import { selectDarkMode } from "../layout/DarkModeSlice";

import "./style.css";
import { getDetailStory } from "../../services/apiStoriesRequest";

const ReadStories = () => {
  const [chapter, setChapter] = useState();

  const { id, slug } = useParams();
  console.log(id, slug);
  // /658c4c2be120ddf21990fb70
  const isDarkModeEnable = useSelector(selectDarkMode);
  const [story, setStory] = useState([]);
  const [activeBtn, setActiveBtn] = useState(false);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  // const [chapters,setChapters] = useState([])
  const user = useSelector((state) => state?.auth.login.currentUser);

  const userId = user?._id;

  useEffect(() => {
    const fetchData = async () => {
      const res = await getDetailStory(slug)
      if (res.data) {
        setStory(res.data.data);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `https://sv1.otruyencdn.com/v1/api/chapter/${id}`
      );
      if (res.data) {
        setChapter(res.data.data);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    fetchData();
  }, [id, activeBtn]);
  const saveHistory = async () => {
    try {
      const currentSlug = slug;
      const storyInfo = story;
      const currentChapter = chapter?.item.chapter_name;
      const currentChapterId = id;
      await axios.post("http://localhost:8000/api/history/save", {
        currentChapterId,
        userId,
        slug: currentSlug,
        storyInfo,
        chapter: currentChapter,
      });
    } catch (error) {
      console.error("Error saving chapter view history:", error);
    }
  };

  useEffect(() => {
    if (chapter) {
      saveHistory();
    }
  }, [chapter]);

  //scoll to top

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const handleScroll = () => {
    if (window.scrollY < 40) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        // Show button when scrolled down more than 100px
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //previus and next chapter

  const getNextChapterId = (currentChapterId, chapters) => {
    console.log(currentChapterId);
    const currentIndex = story.item?.chapters[0].server_data?.findIndex(
      (chap) => chap.chapter_api_data.split("/").pop() === currentChapterId
    );
    if (currentIndex === -1) {
      console.error("Không tìm thấy chap hiện tại trong danh sách.");
      return null;
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex >= 0 && nextIndex < chapters.length) {
      return chapters[nextIndex].chapter_api_data.split("/").pop();
    } else {
      console.error("Không tìm thấy chap tiếp theo.");
      return null;
    }
  };
  const getPreviousChapterId = (currentChapterId, chapters) => {
    const currentIndex = story.item?.chapters[0].server_data?.findIndex(
      (chap) => chap.chapter_api_data.split("/").pop() === currentChapterId
    );
    if (currentIndex === -1) {
      console.error("Không tìm thấy chap hiện tại trong danh sách.");
      return null;
    }
    const previousIndex = currentIndex - 1;
    console.log(currentIndex);
    if (previousIndex >= 0 && previousIndex < chapters.length) {
      return chapters[previousIndex].chapter_api_data.split("/").pop();
    } else {
      console.error("Không tìm thấy chap trước đó.");
      return null;
    }
  };

  const handleChangeToPreviousChapter = () => {
    const previousChapterId = getPreviousChapterId(
      id,
      story.item?.chapters[0].server_data
    );
    if (previousChapterId) {
      navigate(`/detail/${slug}/view/${previousChapterId}`);
    }
  };
  const handleChangeToNextChapter = () => {
    const nextChapterId = getNextChapterId(
      id,
      story.item?.chapters[0].server_data
    );
    if (nextChapterId) {
      navigate(`/detail/${slug}/view/${nextChapterId}`);
    }
  };
  const handleChangeChapter = (e) => {
    const id = e.target.value;
    console.log(id);
    navigate(`/detail/${slug}/view/${id}`);
  };

  // history

  useEffect(() => {
    if (!chapter) return; // Kiểm tra nếu chapter chưa có, thì không làm gì cả

    // Sau khi chapter đã được lấy về từ API, bạn có thể gọi hàm saveChapterViewHistory
    saveChapterViewHistory();
  }, [chapter]);

  const saveChapterViewHistory = () => {
    const timestamp = new Date().getTime();
    const currentSlug = slug;
    const currentChapter = chapter?.item?.chapter_name;
    const currentChapterId = id;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - 7); // Ngày hết hạn là 7 ngày trước đó

    const existingHistory = localStorage.getItem("historyChapter");
    let historyChapter = existingHistory ? JSON.parse(existingHistory) : [];

    // Loại bỏ các mục cũ hơn 7 ngày
    historyChapter = historyChapter.filter((item) => {
      const itemExpirationDate = new Date(item.expirationDate);
      return itemExpirationDate.getTime() > expirationDate.getTime();
    });

    // Thêm mục mới vào lịch sử
    historyChapter.push({
      slug: currentSlug,
      timestamp,
      expirationDate,
      currentChapter,
      currentChapterId,
      story: story,
    });

    // Cập nhật localStorage
    localStorage.setItem("historyChapter", JSON.stringify(historyChapter));
  };

  // Rest of your component code...

  const active = true;
  return (
    <div className="bg-[#333333]">
      <NavBar />
      <div className="relative">
        <header
          className={`${
            isDarkModeEnable
              ? "bg-bg_dark_light text-text_darkMode"
              : "bg-white"
          } p-5 h-fit mt-10 w-[90%] m-auto`}
        >
          <div>
            <ul className="flex gap-1 text-[#A699A6]">
              <Link to={"/"}>
                <li className="hover:text-primary-color cursor-pointer">
                  Trang chủ &gt;{" "}
                </li>
              </Link>
              <Link to={`/detail/${id}`}>
                <li className="hover:text-primary-color cursor-pointer">
                  {chapter?.item.comic_name} &gt;
                </li>
              </Link>
              <li className="hover:text-primary-color cursor-pointer">
                {chapter?.item.chapter_name}
              </li>
            </ul>
          </div>

          <div className="m-auto text-center text-2xl font-semibold  mt-5">
            <a className="hover:text-primary-color" href="#">
              {chapter?.item.comic_name}{" "}
            </a>
            <span className="text-[#999999]">
              {" "}
              - Chapter {chapter?.item.chapter_name}
            </span>
          </div>
          <div className="text-[#999999]  text-center">
            Nếu không xem được truyện vui lòng đổi "SERVER ẢNH" bên dưới
          </div>
          {/* <div className='text-white w-full flex justify-center gap-2 mt-3'>
              <button className={`${active ? "bg-[#E59FF3]": " bg-primary-color"} px-2 py-1 rounded-md`}>Server 1</button>
              <button className="px-2 py-1 rounded-md bg-primary-color">Server 2</button>
              <button className="px-2 py-1 rounded-md bg-primary-color">Server 3</button>
            </div> */}
          <div className="w-full flex justify-center mt-5 text-white">
            <button className=" px-2 py-1 rounded-md bg-[#F0AD4E]">
              <FontAwesomeIcon icon={faCircleExclamation} /> Báo lỗi
            </button>
          </div>

          <div className="bg-[#BDE5F8] w-[95%] m-auto mt-3 py-2 text-primary-color text-center">
            {" "}
            <FontAwesomeIcon icon={faCircleInfo} /> Sử dụng mũi tên trái (←)
            hoặc phải (→) để chuyển chương
          </div>

          <div className={`${isDarkModeEnable ? "text-white" : "text-slate-500"} flex justify-center items-center gap-2 mt-5 text-sm`}>
            <button
              className="px-3 rounded-full font-semibold text-xl"
              onClick={handleChangeToPreviousChapter}
              disabled={
                !getPreviousChapterId(id, story.item?.chapters[0].server_data)
              }
            >
              <FontAwesomeIcon icon={faArrowRight} rotation={180} size="sm" />
            </button>

            <select
              className="bg-[#DDDDDD] phone:w-32 lg:w-40 py-1 px-2 rounded-full text-[#777]"
              value={chapter?.item._id}
              onChange={handleChangeChapter}
            >
              {story.item?.chapters[0].server_data?.map((chap) => {
                // console.log(chap.chapter_api_data.split('/').pop())
                return (
                  <option
                    className={`${
                      isDarkModeEnable ? "bg-[#252A34]" : "bg-[#EEF3FD]"
                    } 
                              rounded-md border-[1px] border-bd-color transition flex-row justify-start items-center p-4 hover:bg-primary-color hover:text-white`}
                    value={chap.chapter_api_data.split("/").pop()}
                  >
                    <p>Chapter {chap.chapter_name}</p>
                  </option>
                );
              })}
            </select>
            <button
              className="px-3 rounded-full font-semibold text-xl"
              onClick={handleChangeToNextChapter}
              disabled={
                !getNextChapterId(id, story.item?.chapters[0].server_data)
              }
            >
              <FontAwesomeIcon icon={faArrowRight} size="sm" />
            </button>
          </div>
        </header>
        <div className=" w-full flex flex-col justify-center mt-32">
          {chapter?.item.chapter_image.map((i) => (
            <img
              loading="lazy"
              className="phone:mx-5 laptop:mx-40 desktop:mx-60"
              src={`https://sv1.otruyencdn.com/${chapter.item.chapter_path}/${i.image_file}`}
              alt="anh"
            ></img>
          ))}
        </div>
        <div
          className={`phone:text-sm bg-[#242526] py-1  lg:py-3 w-full fixed flex justify-center  
              phone:justify-around lg:gap-4 items-center bottom-0 ${
                isVisible ? "" : "hidden"
              }`}
        >
          <Link to={"/"}>
            <button className="lg:py-2 py-1 px-4 bg-[#8BC34A] text-white rounded-md">
              {" "}
              <FontAwesomeIcon icon={faHome} />{" "}
              <span className="phone:hidden lg:inline">Trang chủ</span>
            </button>
          </Link>
          <div className="flex justify-center gap-2">
            <button
              className={`${
                !getPreviousChapterId(id, story.item?.chapters[0].server_data)
                  ? "bg-[#B3C8F8] cursor-not-allowed"
                  : "bg-primary-color"
              } px-3 py-1 rounded-full font-semibold text-white text-xl`}
              onClick={handleChangeToPreviousChapter}
              disabled={
                !getPreviousChapterId(id, story.item?.chapters[0].server_data)
              }
            >
              <FontAwesomeIcon icon={faArrowRight} rotation={180} />
            </button>
            <select
              className="bg-[#DDDDDD] phone:w-32 lg:w-40 py-1 px-2 rounded-full text-[#777]"
              value={chapter?.item._id}
              onChange={handleChangeChapter}
            >
              {story.item?.chapters[0].server_data?.map((chap) => {
                // console.log(chap.chapter_api_data.split('/').pop())

                return (
                  <option
                    className={`${
                      isDarkModeEnable ? "bg-[#252A34]" : "bg-[#EEF3FD]"
                    } 
                              rounded-md border-[1px] border-bd-color transition flex-row justify-start items-center p-4 hover:bg-primary-color hover:text-white`}
                    value={chap.chapter_api_data.split("/").pop()}
                  >
                    <p>Chapter {chap.chapter_name}</p>
                  </option>
                );
              })}
            </select>
            <button
              className={`${
                !getNextChapterId(id, story.item?.chapters[0].server_data)
                  ? "bg-[#B3C8F8] cursor-not-allowed"
                  : "bg-primary-color"
              } px-3 py-1 rounded-full font-semibold text-white text-xl`}
              onClick={handleChangeToNextChapter}
              disabled={
                !getNextChapterId(id, story.item?.chapters[0].server_data)
              }
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
          <button className="py-1 px-4 bg-[#ff3860] text-white rounded-md">
            {" "}
            <FontAwesomeIcon icon={faHeart} />{" "}
            <span className="phone:hidden lg:inline">Theo dõi</span>
          </button>
        </div>
      </div>
      <div className="fixed bottom-16 right-10">
        {isVisible && (
          <button
            onClick={scrollToTop}
            className="bounce bg-gray-800 shadow-md text-white py-3 px-4 rounded-full focus:outline-none"
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ReadStories;
