import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Modal, Checkbox, Input, Space, message } from "antd";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
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
import { useSelector, useDispatch } from "react-redux";
import { selectDarkMode } from "../layout/DarkModeSlice";

import "./style.css";
import {
  addStoryError,
  getDetailStory,
  addFavoritesStoryAPI,
  removeFavoritesStory,
  incrementStoryView,
} from "../../services/apiStoriesRequest";

const ReadStories = () => {
  const [chapter, setChapter] = useState();

  const { id, slug } = useParams();
  const dispatch = useDispatch();
  // /658c4c2be120ddf21990fb70
  const isDarkModeEnable = useSelector(selectDarkMode);
  const [story, setStory] = useState([]);
  const [activeBtn, setActiveBtn] = useState(false);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [isErorr, setIsErorr] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  // const [chapters,setChapters] = useState([])
  const user = useSelector((state) => state?.auth.login.currentUser);
  const favorites = useSelector(
    (state) => state.favorite.favorites?.allFavorites,
  );
  const userId = user?._id;
  const nameUser = user?.username;
  const accessToken = user?.accessToken
  useEffect(() => {
    const fetchData = async () => {
      const res = await getDetailStory(slug);
      if (res.data) {
        setStory(res.data.data);
      }
    };
    fetchData();
  }, []);

  // Check isFavorite khi favorites thay đổi
  useEffect(() => {
    if (favorites && favorites.length > 0) {
      const isFav = favorites.some((fav) => fav.slug === slug);
      setIsFavorite(isFav);
    }
  }, [favorites, slug]);
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
      const currentChapter = chapter?.item.chapter_name;
      const currentChapterId = id;
      await axios.post(`${process.env.REACT_APP_API_URL}/api/history/save`, {
        chapterId: currentChapterId,
        userId,
        slug,
        storyInfo: story,
        chapter: currentChapter,
      });
    } catch (error) {
      console.error("Error saving chapter view history:", error);
    }
  };
  const addToFavorites = async (e) => {
    e.preventDefault();

    if (!user) {
      message.warning("Vui lòng đăng nhập để theo dõi truyện");
      return;
    }

    if (!slug) {
      console.error("Slug không được rỗng!");
      return;
    }

    if (loadingFav) return;

    setLoadingFav(true);

    try {
      const storyInfo = {
        _id: uuidv4(),
        slug,
        story,
      };

      await addFavoritesStoryAPI(accessToken, storyInfo, userId);

      setIsFavorite(true);
      message.success("Đã thêm vào yêu thích");
    } catch (err) {
      console.error(err);
      message.error("Thêm thất bại");
    } finally {
      setLoadingFav(false);
    }
  };

  const removeFromFavorites = (e) => {
    e.preventDefault();
    removeFavoritesStory(accessToken, slug, userId, dispatch);
    setIsFavorite(false);
    message.warning("đã bỏ theo dõi ");
  };


  //scoll to top

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //previus and next chapter

  const getNextChapterId = (currentChapterId, chapters) => {
    console.log(currentChapterId);
    const currentIndex = story.item?.chapters[0]?.server_data?.findIndex(
      (chap) => chap.chapter_api_data.split("/").pop() === currentChapterId
    );
    if (currentIndex === -1) {
      return null;
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex >= 0 && nextIndex < chapters.length) {
      return chapters[nextIndex].chapter_api_data.split("/").pop();
    } else {
      return null;
    }
  };
  const getPreviousChapterId = (currentChapterId, chapters) => {
    const currentIndex = story.item?.chapters[0]?.server_data?.findIndex(
      (chap) => chap.chapter_api_data.split("/").pop() === currentChapterId
    );
    if (currentIndex === -1) {
      return null;
    }
    const previousIndex = currentIndex - 1;
    if (previousIndex >= 0 && previousIndex < chapters.length) {
      return chapters[previousIndex].chapter_api_data.split("/").pop();
    } else {
      return null;
    }
  };

  const handleChangeToPreviousChapter = () => {
    const previousChapterId = getPreviousChapterId(
      id,
      story.item?.chapters[0]?.server_data
    );
    if (previousChapterId) {
      navigate(`/detail/${slug}/view/${previousChapterId}`);
    }
  };
  const handleChangeToNextChapter = () => {
    const nextChapterId = getNextChapterId(
      id,
      story.item?.chapters[0]?.server_data
    );
    if (nextChapterId) {
      navigate(`/detail/${slug}/view/${nextChapterId}`);
    }
  };
  const handleChangeChapter = (e) => {
    const id = e.target.value;
    navigate(`/detail/${slug}/view/${id}`);
  };

  // history

  useEffect(() => {
    if (!chapter) return;

    // Tăng lượt xem cho TẤT CẢ người dùng (kể cả chưa đăng nhập)
    incrementStoryView(slug, story?.item?.name || "");

    if (userId) {
      // Đã đăng nhập → lưu vào server (mỗi user có history riêng)
      saveHistory();
    } else {
      // Chưa đăng nhập → lưu vào localStorage làm fallback
      const timestamp = new Date().getTime();
      const currentChapter = chapter?.item?.chapter_name;
      const currentChapterId = id;
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);

      const existingHistory = localStorage.getItem("historyChapter");
      let historyChapter = existingHistory ? JSON.parse(existingHistory) : [];

      const now = new Date().getTime();
      historyChapter = historyChapter.filter((item) => {
        return new Date(item.expirationDate).getTime() > now;
      });

      const existingIndex = historyChapter.findIndex((item) => item.slug === slug);
      const historyEntry = {
        slug,
        timestamp,
        expirationDate,
        currentChapter,
        currentChapterId,
        story,
      };

      if (existingIndex !== -1) {
        historyChapter[existingIndex] = historyEntry;
      } else {
        historyChapter.push(historyEntry);
      }

      localStorage.setItem("historyChapter", JSON.stringify(historyChapter));
    }
  }, [chapter]);

  // Rest of your component code...
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    if (!isErorr.trim()) {
      message.warning("Vui lòng nhập nội dung lỗi!");
      return;
    }

    try {
      const userID = userId;
      const userName = nameUser;
      const nameErr = isErorr;
      const storyInfo = story?.item?.name;
      const chapterInfo = chapter?.item?.chapter_name || "";

      await addStoryError(userID, userName, nameErr, storyInfo, accessToken, chapterInfo);

      message.success("Đã gửi lỗi thành công!");

      setIsModalOpen(false);   // đóng modal
      setIsErorr("");          // reset input
    } catch (error) {
      message.error("Gửi lỗi thất bại!");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="bg-[#333333]">
      <NavBar />
      <div className="relative">
        <header
          className={`${isDarkModeEnable
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
          {/* <div className="text-[#999999]  text-center">
            Nếu không xem được truyện vui lòng đổi "SERVER ẢNH" bên dưới
          </div> */}
          {/* <div className='text-white w-full flex justify-center gap-2 mt-3'>
              <button className={`${active ? "bg-[#E59FF3]": " bg-primary-color"} px-2 py-1 rounded-md`}>Server 1</button>
              <button className="px-2 py-1 rounded-md bg-primary-color">Server 2</button>
              <button className="px-2 py-1 rounded-md bg-primary-color">Server 3</button>
            </div> */}
          <div className="w-full flex justify-center mt-5 text-white">
            <button
              onClick={showModal}
              className=" px-2 py-1 rounded-md bg-[#F0AD4E]"
            >
              <FontAwesomeIcon icon={faCircleExclamation} /> Báo lỗi
            </button>
            {user ?

              <Modal
                title="Nhập nội dung lỗi"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okButtonProps={{
                  className: "bg-blue-500 text-white hover:bg-blue-600"
                }}
              >
                <div>
                  <Input
                    placeholder="Nội dung lỗi"
                    onChange={(e) => setIsErorr(e.target.value)}
                  />
                </div>
              </Modal>
              :
              <Modal title="bạn cần đăng nhập để báo lỗi" open={isModalOpen} onCancel={handleCancel}>
                <button><a href="/login" className="text-xl">Đăng nhập ngay</a></button>
              </Modal>
            }
          </div>

          <div className="bg-[#BDE5F8] w-[95%] m-auto mt-3 py-2 text-primary-color text-center">
            {" "}
            <FontAwesomeIcon icon={faCircleInfo} /> Sử dụng mũi tên trái (←)
            hoặc phải (→) để chuyển chương
          </div>

          <div
            className={`${isDarkModeEnable ? "text-white" : "text-slate-500"
              } flex justify-center items-center gap-2 mt-5 text-sm`}
          >
            <button
              className="px-3 rounded-full font-semibold text-xl"
              onClick={handleChangeToPreviousChapter}
              disabled={
                !getPreviousChapterId(id, story?.item?.chapters[0]?.server_data)
              }
            >
              <FontAwesomeIcon icon={faArrowRight} rotation={180} size="sm" />
            </button>

            <select
              className="bg-[#DDDDDD] phone:w-32 lg:w-40 py-1 px-2 rounded-full text-[#777]"
              value={chapter?.item._id}
              onChange={handleChangeChapter}
            >
              {story.item?.chapters[0]?.server_data?.map((chap) => {
                return (
                  <option
                    className={`${isDarkModeEnable ? "bg-[#252A34]" : "bg-[#EEF3FD]"
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
                !getNextChapterId(id, story.item?.chapters[0]?.server_data)
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
              phone:justify-around lg:gap-4 items-center bottom-0 ${isVisible ? "" : "hidden"
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
              className={`${!getPreviousChapterId(id, story.item?.chapters[0]?.server_data)
                ? "bg-[#B3C8F8] cursor-not-allowed"
                : "bg-primary-color"
                } px-3 py-1 rounded-full font-semibold text-white text-xl`}
              onClick={handleChangeToPreviousChapter}
              disabled={
                !getPreviousChapterId(id, story.item?.chapters[0]?.server_data)
              }
            >
              <FontAwesomeIcon icon={faArrowRight} rotation={180} />
            </button>
            <select
              className="bg-[#DDDDDD] phone:w-32 lg:w-40 py-1 px-2 rounded-full text-[#777]"
              value={chapter?.item._id}
              onChange={handleChangeChapter}
            >
              {story.item?.chapters[0]?.server_data?.map((chap) => {

                return (
                  <option
                    className={`${isDarkModeEnable ? "bg-[#252A34]" : "bg-[#EEF3FD]"
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
              className={`${!getNextChapterId(id, story.item?.chapters[0]?.server_data)
                ? "bg-[#B3C8F8] cursor-not-allowed"
                : "bg-primary-color"
                } px-3 py-1 rounded-full font-semibold text-white text-xl`}
              onClick={handleChangeToNextChapter}
              disabled={
                !getNextChapterId(id, story.item?.chapters[0]?.server_data)
              }
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
          {isFavorite ? (
            <button
              onClick={removeFromFavorites}
              className={`py-1 px-4 rounded-md flex items-center gap-2 transition-all duration-200
      ${isDarkModeEnable
                  ? "bg-[#AA0022] hover:bg-[#7D0B22] text-text_darkMode"
                  : "bg-[#701f2f] hover:bg-[#FF7A95] text-white"
                }`}
            >
              <FontAwesomeIcon icon={faHeart} />
              <span className="phone:hidden lg:inline">
                Bỏ theo dõi
              </span>
            </button>
          ) : (
            <button
              disabled={!user}
              onClick={addToFavorites}
              className={`py-1 px-4 rounded-md flex items-center gap-2 transition-all duration-200
      ${!user
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : isDarkModeEnable
                    ? "bg-[#AA0022] hover:bg-[#7D0B22] text-text_darkMode"
                    : "bg-[#FF3860] hover:bg-[#FF7A95] text-white"
                }`}
            >
              <FontAwesomeIcon icon={faHeart} />
              <span className="phone:hidden lg:inline">
                Theo dõi
              </span>
            </button>
          )}

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
