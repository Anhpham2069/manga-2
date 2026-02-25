import React, { useRef, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { vi } from "date-fns/locale";
import NavBar from "../layout/Navbar";
import Footer from "../layout/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {faSun,} from "@fortawesome/free-regular-svg-icons"
import {
  faUser,
  faSignal,
  faEye,
  faHeart,
  faClock,
  faBusinessTime,
  faBook,
  faBookTanakh,
  faBookOpen,
  faArrowRightArrowLeft,
  faStar,
  faCaretRight,
  faCaretLeft,
  faCommentDots,
  faPaperPlane,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import CardStories from "../components/cardStories";
import { useDispatch, useSelector } from "react-redux";
import { selectDarkMode } from "../layout/DarkModeSlice";

import { Data } from "../../services/Data";
import axios from "axios";
import { message } from "antd";
import {
  addFavoritesStory,
  addFavoritesStoryAPI,
  getAllFavorites,
  getAllHistory,
  getDetailStory,
  getFavoritesByUser,
  getLastChapter,
  removeFavoritesStory,
  addComment,
  getCommentsByStory,
} from "../../services/apiStoriesRequest";

const DetailStories = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // redux
  const isDarkModeEnable = useSelector(selectDarkMode);
  const user = useSelector((state) => state?.auth.login.currentUser);
  const favorites = useSelector(
    (state) => state.favorite.favorites?.allFavorites,
  );
  const conutFavorites = useSelector(
    (state) => state.favorite.countFavorites?.alLCountFavorites,
  );
  const countHistory = useSelector(
    (state) => state.favorite.countHistory?.alLCountHistory,
  );
  const accessToken = user?.accessToken;
  const userId = user?._id;

  //state
  const [story, setStory] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [readHistory, setReadHistory] = useState();
  const [loadingFav, setLoadingFav] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Fetch comments
  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const data = await getCommentsByStory(slug);
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [slug]);

  const handleSubmitComment = async () => {
    if (!user) {
      message.warning("Bạn cần đăng nhập để bình luận");
      return;
    }

    if (!comment.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận");
      return;
    }

    try {
      await addComment(accessToken, slug, userId, user.username, comment);
      message.success("Đã gửi bình luận");
      setComment("");
      fetchComments();
    } catch (error) {
      message.error("Gửi bình luận thất bại");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getLastChapter(slug);
        if (res) {
          const chapterCurrent = res.chapter;
          setReadHistory(chapterCurrent);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [slug]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDetailStory(slug);
        if (res.data) {
          setStory(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    getFavoritesByUser(accessToken, userId, dispatch);
  }, [slug]);

  // Check isFavorite khi favorites thay đổi
  useEffect(() => {
    if (favorites && favorites.length > 0) {
      const isFav = favorites.some((fav) => fav.slug === slug);
      setIsFavorite(isFav);
    }
  }, [favorites, slug]);
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

  // const addToFavorites = (e) => {
  //   e.preventDefault();
  //   console.log(slug);
  //   if (slug) {
  //     const id = uuidv4();
  //     const storyInfo = {
  //       _id: id,
  //       slug: slug,
  //       story: story,
  //     };
  //      addFavoritesStory(accessToken, storyInfo, userId, dispatch);
  //     setIsFavorite(true);
  //     message.success("Đã thêm vào yêu thích");
  //   } else {
  //     console.error("Slug không được rỗng!");
  //   }
  // };



  const removeFromFavorites = (e) => {
    e.preventDefault();
    removeFavoritesStory(accessToken, slug, userId, dispatch);
    setIsFavorite(false);
    message.warning("đã bỏ theo dõi ");
  };

  const filteredChapters = story.item?.chapters[0]?.server_data?.filter(
    (chap) => {
      return chap.chapter_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    },
  );

  const containerRef = useRef(null);

  const scroll = (scollOffset) => {
    containerRef.current.scrollLeft += scollOffset;
  };

  // time update story
  let timeUpdate = "";
  if (story.seoOnPage?.updated_time) {
    const epochTime = story.seoOnPage.updated_time;
    const dateFromEpoch = new Date(epochTime);
    timeUpdate = formatDistanceToNow(dateFromEpoch, {
      addSuffix: true,
      locale: vi,
    });
  } else {
    timeUpdate = "N/A";
  }
  const chapterLength = story.item?.chapters[0]?.server_data?.length || 0;
  const hasChapters = chapterLength > 0;

  const currentChapterRef = useRef(null);

  useEffect(() => {
    if (currentChapterRef.current) {
      currentChapterRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  const scrollToCurrentChapter = (e) => {
    e.preventDefault();
    if (currentChapterRef.current) {
      currentChapterRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <div className={`${isDarkModeEnable ? "bg-bg_dark" : "bg-bg_light"}`}>
      <NavBar />
      <div className="min-h-screen">


        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          {/* header */}
          <div className=" grid phone:grid-cols-1 phone:gap-0  laptop:grid-cols-5 lg:gap-4">
            <div className="w-full">
              {/* Ảnh truyện */}
              <div className="w-full flex justify-center">
                <img
                  className="
        w-full
        max-w-xs
        sm:max-w-sm
        md:max-w-md
        lg:max-w-full
        h-64
        sm:h-72
        md:h-80
        lg:h-96
        object-cover
        rounded-lg
        shadow-md
      "
                  src={`https://img.otruyenapi.com/uploads/comics/${slug}-thumb.jpg`}
                  alt="anh"
                />
              </div>

              {/* Nút đọc ngay */}
              {hasChapters ? (
                <Link
                  to={`view/${story.item?.chapters[0]?.server_data[0]?.chapter_api_data
                    ?.split("/")
                    .pop()}`}
                >
                  <button
                    className={`${isDarkModeEnable
                      ? "bg-[#3963C0] text-text_darkMode hover:bg-[#2f4fa0]"
                      : "bg-primary-color text-white hover:opacity-90"
                      } mt-5 w-full py-3 rounded-lg uppercase font-semibold transition duration-200`}
                  >
                    Đọc ngay
                  </button>
                </Link>
              ) : (
                <button
                  disabled
                  className="mt-5 w-full py-3 rounded-lg uppercase font-semibold bg-gray-400 text-white cursor-not-allowed"
                >
                  Chưa có chương
                </button>
              )}

              {/* Thông tin truyện */}
              <aside
                className={`
      ${isDarkModeEnable ? "bg-bg_dark_light text-text_darkMode" : "bg-white"}
      mt-5
      p-4
      rounded-lg
      shadow-sm
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-2
      gap-4
      text-sm
    `}
              >
                <div className="flex flex-col">
                  <span className="flex items-center gap-2 font-medium opacity-80">
                    <FontAwesomeIcon icon={faUser} />
                    Tác giả
                  </span>
                  <p className="mt-1 break-words">
                    {story.seoOnPage?.seoSchema.director}
                  </p>
                </div>

                <div className="flex flex-col">
                  <span className="flex items-center gap-2 font-medium opacity-80">
                    <FontAwesomeIcon icon={faSignal} />
                    Trạng thái
                  </span>
                  <p className="mt-1">Đang tiến hành</p>
                </div>

                <div className="flex flex-col">
                  <span className="flex items-center gap-2 font-medium opacity-80">
                    <FontAwesomeIcon icon={faEye} />
                    Lượt xem
                  </span>
                  <p className="mt-1">10.000</p>
                </div>

                <div className="flex flex-col">
                  <span className="flex items-center gap-2 font-medium opacity-80">
                    <FontAwesomeIcon icon={faHeart} />
                    Theo dõi
                  </span>
                  <p className="mt-1">1000</p>
                </div>

                <div className="flex flex-col">
                  <span className="flex items-center gap-2 font-medium opacity-80">
                    <FontAwesomeIcon icon={faClock} />
                    Đăng vào
                  </span>
                  <p className="mt-1">{story?.item?.updatedAt?.slice(0, 10)}</p>
                </div>

                <div className="flex flex-col">
                  <span className="flex items-center gap-2 font-medium opacity-80">
                    <FontAwesomeIcon icon={faBusinessTime} />
                    Cập nhật
                  </span>
                  <p className="mt-1">{timeUpdate}</p>
                </div>
              </aside>
            </div>

            <div
              className={`${isDarkModeEnable
                ? "bg-bg_dark_light text-text_darkMode"
                : "bg-white"
                } h-fit phone:mt-4 laptop:mt-0  col-span-4  p-7`}
            >
              <div>
                <header>
                  <p className="font-bold uppercase text-lg">
                    {story.item?.name}
                  </p>
                  <p>tên khác: {story.seoOnPage?.seoSchema.name}</p>
                </header>
                <div className="flex flex-wrap gap-1 mt-3">
                  {story.item?.category?.map((cate) => {
                    return (
                      <NavLink to={`/category/${cate.slug}`} key={cate.id}>
                        <p
                          className={`${isDarkModeEnable ? "bg-[#252A34]" : "bg-[#EEF3FD]"
                            } border-[1px] rounded-md
                             mr-4 text-primary-color text-sm border-primary-color p-1  hover:bg-primary-color hover:text-white`}
                        >
                          {cate.name}
                        </p>
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              <div className="w-full flex flex-col tablet:flex-row items-stretch tablet:items-center gap-3 tablet:gap-5 justify-center mt-5 px-3 tablet:px-0">
                {/* BẮT ĐẦU ĐỌC */}
                <Link
                  to={
                    hasChapters
                      ? `view/${story.item?.chapters[0]?.server_data[0]?.chapter_api_data
                        ?.split("/")
                        .pop()}`
                      : "#"
                  }
                  className={`flex items-center justify-center gap-2 h-11 phone:w-full tablet:w-52 rounded-md font-medium
                  ${hasChapters
                      ? "bg-[#8BC34A] hover:bg-[#B2D786]"
                      : "bg-gray-400 cursor-not-allowed"
                    }
                `}
                >
                  <FontAwesomeIcon icon={faBook} />
                  {hasChapters ? "Bắt đầu đọc" : "Chưa có chương"}
                </Link>

                {/* CHƯƠNG MỚI NHẤT */}
                <Link
                  to={
                    hasChapters
                      ? `view/${story.item?.chapters[0]?.server_data[
                        chapterLength - 1
                      ]?.chapter_api_data
                        ?.split("/")
                        .pop()}`
                      : "#"
                  }
                  className={`flex items-center justify-center gap-2 h-11 phone:w-full tablet:w-52 rounded-md transition-all duration-200 font-medium ${hasChapters
                    ? isDarkModeEnable
                      ? "bg-[#970DB3] hover:bg-[#701483] text-text_darkMode"
                      : "bg-[#BD10E0] hover:bg-[#D360EA]"
                    : "bg-gray-400 cursor-not-allowed text-white"
                    }`}
                >
                  <FontAwesomeIcon icon={faBookTanakh} />
                  {hasChapters ? "Chương mới nhất" : "Chưa có chương"}
                </Link>


                {/* THEO DÕI */}
                {isFavorite ? (
                  <button
                    onClick={removeFromFavorites}
                    className={`flex items-center justify-center gap-2 h-11 phone:w-full tablet:w-52 rounded-md transition-all duration-200 font-medium ${isDarkModeEnable
                      ? "bg-[#AA0022] hover:bg-[#7D0B22] text-text_darkMode"
                      : "bg-[#701f2f] hover:bg-[#FF7A95]"
                      }`}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                    Bỏ Theo Dõi
                  </button>
                ) : (
                  <button
                    disabled={!user}
                    onClick={addToFavorites}
                    className={`flex items-center justify-center gap-2 h-11 phone:w-full tablet:w-52 rounded-md transition-all duration-200 font-medium
                      ${!user
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : isDarkModeEnable
                          ? "bg-[#AA0022] hover:bg-[#7D0B22] text-text_darkMode"
                          : "bg-[#FF3860] hover:bg-[#FF7A95]"
                      }`}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                    Theo Dõi
                  </button>
                )}
              </div>

              <div className="mt-5 px-3 tablet:px-0">
                <p className="font-bold text-lg mb-2">Giới thiệu</p>
                <p className="leading-7 text-justify">
                  {story.seoOnPage?.descriptionHead}
                </p>
              </div>

              <div className="mt-14">
                {/* DANH SÁCH CHƯƠNG */}
                <div className="mt-10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-primary-color">
                      <FontAwesomeIcon icon={faBookOpen} /> Danh sách chương
                    </h3>
                    <button
                      onClick={scrollToCurrentChapter}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
                    >
                      Cuộn tới chương đang đọc
                    </button>
                  </div>

                  <input
                    className="w-full h-10 px-4 mb-6 rounded-lg border outline-none"
                    placeholder="Tìm chương..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-2">
                    {filteredChapters?.map((chap) => {
                      const currentChapterIndex = parseInt(readHistory);
                      const isCurrentChapter =
                        currentChapterIndex === parseInt(chap.chapter_name);

                      return (
                        <Link
                          key={chap.chapter_name}
                          to={`view/${chap.chapter_api_data.split("/").pop()}`}
                        >
                          <div
                            ref={isCurrentChapter ? currentChapterRef : null}
                            className={`relative p-3 rounded-lg border transition-all duration-300 text-center
                              ${isCurrentChapter
                                ? "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white font-semibold shadow-lg animate-pulse scale-105"
                                : "hover:bg-primary-color hover:text-white"
                              }
                            `}
                          >
                            {isCurrentChapter && (
                              <span className="absolute -top-2 -right-2 text-xl animate-bounce">
                                🔥
                              </span>
                            )}
                            Chapter {chap.chapter_name}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* recommend */}

        <div
          className={`${isDarkModeEnable
            ? "bg-bg_dark_light text-text_darkMode"
            : "bg-white"
            } h-fit mt-40 m-auto laptop:w-[90%] shadow-lg `}
        >
          <div className="py-1 h-12 flex items-center justify-between px-4 text-primary-color border-b-[1px] border-[#F0F0F0] ">
            <button className=" text-lg font-semibold h-4/5  flex items-center justify-center rounded-lg">
              <FontAwesomeIcon icon={faStar} className="mr-2" /> Bạn có thể
              thích
            </button>
            <div>
              <FontAwesomeIcon
                icon={faCaretLeft}
                size="xl"
                className="mr-3 cursor-pointer"
                onClick={() => scroll(-100)}
              />
              <FontAwesomeIcon
                icon={faCaretRight}
                size="xl"
                className="cursor-pointer"
                onClick={() => scroll(+100)}
              />
            </div>
          </div>
          <div
            className="container-trendStrories h-fit relative p-4 flex overflow-x-scroll scroll-none w-full transition-transform duration-300"
            ref={containerRef}
          >
            {favorites?.map((item) => {
              // const timeAgo = formatDistanceToNow(new Date(item.createdAt), {
              //   addSuffix: true,
              //   locale: vi,
              // });
              // const trimmedTimeAgo = timeAgo.replace(/^khoảng\s/, "");
              // const newestChapter = layChapterMoiNhat(item);
              return (
                <CardStories
                  key={item._id}
                  id={item._id}
                  title={item.story.item.name}
                  img={item.story?.seoOnPage.seoSchema.image}
                  slug={item.slug}
                  // time={trimmedTimeAgo}
                  chapter={item.story.item.chapters[0]?.server_data?.length}
                  nomarl
                />
              );
            })}
          </div>
        </div>

        {/* comment */}
        <div
          className={`${isDarkModeEnable
            ? "bg-bg_dark_light text-text_darkMode"
            : "bg-white"
            } h-fit mt-10 m-auto laptop:w-[90%] shadow-lg`}
        >
          <div className="py-1 h-12 flex items-center justify-between px-4 text-lg font-semibold text-primary-color border-b-[1px] border-[#F0F0F0]">
            <p>
              <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
              <span>Bình luận</span>
            </p>
          </div>

          <div className="h-fit w-full border-[1px] border-[#F0F0F0] flex flex-col py-5 items-center">
            {/* ❌ CHƯA ĐĂNG NHẬP */}
            {!user && (
              <div
                className={`${isDarkModeEnable
                  ? "bg-bg_dark_light text-text_darkMode"
                  : "bg-[#FFBABA]"
                  } text-start w-full p-5 my-5`}
              >
                <p>
                  Bạn cần
                  <Link to={"/login"} className="font-bold ml-1">
                    Đăng nhập
                  </Link>{" "}
                  hoặc{" "}
                  <Link to={"/register"} className="font-bold">
                    Đăng ký
                  </Link>{" "}
                  để bình luận
                </p>
              </div>
            )}

            {/* ✅ ĐÃ ĐĂNG NHẬP */}
            {user && (
              <>
                <div className="relative w-[90%] flex justify-center mb-5">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className={`${isDarkModeEnable
                      ? "bg-bg_dark_light text-text_darkMode"
                      : "bg-white"
                      } h-40 w-full p-4 border-2 border-[#F0F0F0] outline-none rounded-md`}
                    placeholder="Nhập bình luận của bạn..."
                  />
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    size="lg"
                    onClick={handleSubmitComment}
                    className="absolute bottom-4 right-5 text-primary-color cursor-pointer hover:scale-110 transition"
                  />
                </div>

                <button
                  onClick={handleSubmitComment}
                  className="w-60 h-10 bg-primary-color rounded-md text-white hover:opacity-90 transition"
                >
                  Thêm bình luận
                </button>
              </>
            )}

            {/* Danh sách bình luận */}
            <div className="w-[90%] mt-6">
              {loadingComments ? (
                <p className="text-center py-4 opacity-60">Đang tải bình luận...</p>
              ) : comments.length === 0 ? (
                <p className="text-center py-4 opacity-60">Chưa có bình luận nào</p>
              ) : (
                <div className="space-y-4">
                  {comments.map((cmt) => (
                    <div
                      key={cmt._id}
                      className={`${isDarkModeEnable
                        ? "bg-[#252A34] border-[#3a3f4b]"
                        : "bg-[#F9F9F9] border-[#EBEBEB]"
                        } p-4 rounded-lg border`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${isDarkModeEnable ? "bg-[#3963C0]" : "bg-primary-color"
                              }`}
                          >
                            {cmt.username?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="font-semibold text-sm">{cmt.username}</span>
                          <span className="text-xs opacity-50">
                            {new Date(cmt.createdAt).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {user && (user._id === cmt.userId || user.admin) && (
                          <button
                            onClick={async () => {
                              try {
                                await axios.delete(
                                  `${process.env.REACT_APP_API_URL}/api/comment/delete/${cmt._id}`,
                                  { headers: { token: `Bearer ${accessToken}` } }
                                );
                                message.success("Đã xoá bình luận");
                                fetchComments();
                              } catch (err) {
                                message.error("Xoá thất bại");
                              }
                            }}
                            className="text-xs text-red-500 hover:text-red-700 transition"
                          >
                            Xoá
                          </button>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed pl-10">{cmt.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* tag */}
        <div
          className={`${isDarkModeEnable
            ? "bg-bg_dark_light text-text_darkMode"
            : "bg-white"
            } h-fit mt-10 m-auto laptop:w-[90%] shadow-lg `}
        >
          <div className="py-1 h-12 flex items-center  justify-between px-4 text-lg font-semibold text-primary-color border-b-[1px] border-[#F0F0F0] ">
            <p>
              <FontAwesomeIcon icon={faTags} className="mr-2" />
              <span>Tags</span>
            </p>
          </div>
          <div className="relative w-[90%] flex justify-center mb-5 p-4 ">
            <a>
              Nettruyen, Truyenqq, Blogtruyen, Manhuavn, Manhwatv, Tiemsachnho,
              Teamlanhlung, Truyentranhaudio, Vlogtruyen, Vcomi, Doctruyen3q,
              Nhattruyen, Truyện tranh, Truyen tranh online, Đọc truyện tranh,
              Truyện tranh hot, Truyện tranh hay, Truyện ngôn tình, mi2manga,
              vcomycs, otakusan, ocumeo, Nhất Đẳng Gia Đinh, , Nhất Đẳng Gia
              Đinh Nettruyen, Nhất Đẳng Gia Đinh Blogtruyen, Nhất Đẳng Gia Đinh
              truyenqq, Nhất Đẳng Gia Đinh, Nhất Đẳng Gia Đinh Nettruyen, Nhất
              Đẳng Gia Đinh Blogtruyen, Nhất Đẳng Gia Đinh Truyenqq,
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DetailStories;
