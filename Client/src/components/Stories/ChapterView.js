import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Modal, Input, message } from "antd";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faCircleInfo,
  faHeart,
  faHome,
  faChevronLeft,
  faChevronRight,
  faArrowUp,
  faStar,
  faCaretLeft,
  faCaretRight,
  faCommentDots,
  faPaperPlane,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import CardStories from "../components/cardStories";
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
  addComment,
  getCommentsByStory,
  getStorybyCategory,
} from "../../services/apiStoriesRequest";

// ===== CHAPTER NAVIGATION COMPONENT (DRY) =====
const ChapterNav = ({ chapters, currentId, slug, onPrev, onNext, onChange, prevId, nextId, variant = "header" }) => {
  const isDark = useSelector(selectDarkMode);

  const isBottom = variant === "bottom";
  const btnBase = isBottom
    ? "px-3 py-1 rounded-full font-semibold text-white text-lg transition-all duration-200"
    : "px-3 py-1 rounded-full font-semibold text-lg transition-all duration-200";

  const prevDisabled = !prevId;
  const nextDisabled = !nextId;

  return (
    <div className="flex justify-center items-center gap-3">
      <button
        className={`${btnBase} ${prevDisabled
          ? "bg-gray-400/50 cursor-not-allowed text-gray-300"
          : isBottom
            ? "bg-primary-color hover:bg-blue-600"
            : isDark ? "text-white hover:text-primary-color" : "text-slate-500 hover:text-primary-color"
          }`}
        onClick={onPrev}
        disabled={prevDisabled}
        aria-label="Chương trước"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      <select
        className={`phone:w-36 lg:w-44 py-1.5 px-3 rounded-full text-sm font-medium outline-none transition-all ${isDark
          ? "bg-[#374151] text-gray-200 border border-[#4b5563]"
          : "bg-[#f1f5f9] text-gray-600 border border-gray-200"
          }`}
        value={currentId}
        onChange={onChange}
      >
        {chapters?.map((chap) => (
          <option
            key={chap.chapter_name}
            value={chap.chapter_api_data.split("/").pop()}
          >
            Chapter {chap.chapter_name}
          </option>
        ))}
      </select>

      <button
        className={`${btnBase} ${nextDisabled
          ? "bg-gray-400/50 cursor-not-allowed text-gray-300"
          : isBottom
            ? "bg-primary-color hover:bg-blue-600"
            : isDark ? "text-white hover:text-primary-color" : "text-slate-500 hover:text-primary-color"
          }`}
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="Chương sau"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

// ===== MAIN COMPONENT =====
const ReadStories = () => {
  const [chapter, setChapter] = useState(null);
  const [story, setStory] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isErorr, setIsErorr] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [activeServer, setActiveServer] = useState(() => {
    return parseInt(localStorage.getItem("activeServer")) || 1;
  });
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [recommendStories, setRecommendStories] = useState([]);
  const recommendRef = useRef(null);

  const { id, slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDarkModeEnable = useSelector(selectDarkMode);
  const user = useSelector((state) => state?.auth.login.currentUser);
  const favorites = useSelector((state) => state.favorite.favorites?.allFavorites);
  const userId = user?._id;
  const accessToken = user?.accessToken;

  // ===== DERIVED DATA (useMemo) =====
  const serverData = useMemo(
    () => story?.item?.chapters?.[0]?.server_data || [],
    [story]
  );

  const currentIndex = useMemo(() => {
    if (!serverData.length) return -1;
    return serverData.findIndex(
      (chap) => chap.chapter_api_data.split("/").pop() === id
    );
  }, [serverData, id]);

  const prevChapterId = useMemo(() => {
    if (currentIndex <= 0) return null;
    return serverData[currentIndex - 1]?.chapter_api_data.split("/").pop();
  }, [serverData, currentIndex]);

  const nextChapterId = useMemo(() => {
    if (currentIndex === -1 || currentIndex >= serverData.length - 1) return null;
    return serverData[currentIndex + 1]?.chapter_api_data.split("/").pop();
  }, [serverData, currentIndex]);

  const chapterImages = useMemo(
    () => chapter?.item?.chapter_image || [],
    [chapter]
  );

  const chapterPath = chapter?.item?.chapter_path || "";
  const totalImages = chapterImages.length;

  // ===== FETCH STORY DATA =====
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await getDetailStory(slug);
        if (res?.data) {
          setStory(res.data.data);
          // Fetch recommendations from first category
          const categories = res.data.data?.item?.category;
          if (categories && categories.length > 0) {
            try {
              const catRes = await getStorybyCategory(categories[0].slug);
              if (catRes?.items) {
                const filtered = catRes.items.filter((item) => item.slug !== slug);
                setRecommendStories(filtered.slice(0, 6));
              }
            } catch (e) { console.log(e); }
          }
        }
      } catch (error) {
        console.error("Error fetching story:", error);
      }
    };
    fetchStory();
  }, [slug]);

  // ===== FETCH COMMENTS =====
  const fetchComments = useCallback(async () => {
    setLoadingComments(true);
    try {
      const data = await getCommentsByStory(slug);
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = useCallback(async () => {
    if (!user) { message.warning("Bạn cần đăng nhập để bình luận"); return; }
    if (!commentText.trim()) { message.warning("Vui lòng nhập nội dung bình luận"); return; }
    try {
      await addComment(accessToken, slug, userId, user.username, commentText);
      message.success("Đã gửi bình luận");
      setCommentText("");
      fetchComments();
    } catch (error) {
      message.error("Gửi bình luận thất bại");
    }
  }, [commentText, user, accessToken, slug, userId, fetchComments]);

  // ===== FETCH CHAPTER DATA =====
  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await axios.get(
          `https://sv1.otruyencdn.com/v1/api/chapter/${id}`
        );
        if (res.data) {
          setChapter(res.data.data);
          setImagesLoaded(0);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (error) {
        console.error("Error fetching chapter:", error);
      }
    };
    fetchChapter();
  }, [id]);

  // ===== CHECK FAVORITE =====
  useEffect(() => {
    if (favorites?.length > 0) {
      setIsFavorite(favorites.some((fav) => fav.slug === slug));
    }
  }, [favorites, slug]);

  // ===== SCROLL VISIBILITY =====
  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ===== KEYBOARD NAVIGATION =====
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;
      if (e.key === "ArrowLeft" && prevChapterId) {
        navigate(`/detail/${slug}/view/${prevChapterId}`);
      } else if (e.key === "ArrowRight" && nextChapterId) {
        navigate(`/detail/${slug}/view/${nextChapterId}`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevChapterId, nextChapterId, slug, navigate]);

  // ===== SAVE HISTORY & INCREMENT VIEW =====
  useEffect(() => {
    if (!chapter) return;

    incrementStoryView(slug, story?.item?.name || "");

    if (userId) {
      // Server history
      const saveHistory = async () => {
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/api/history/save`, {
            chapterId: id,
            userId,
            slug,
            storyInfo: story,
            chapter: chapter?.item?.chapter_name,
          });
        } catch (error) {
          console.error("Error saving history:", error);
        }
      };
      saveHistory();
    } else {
      // LocalStorage fallback
      const now = Date.now();
      const expirationDate = new Date(now + 7 * 24 * 60 * 60 * 1000);
      const existingHistory = localStorage.getItem("historyChapter");
      let historyChapter = existingHistory ? JSON.parse(existingHistory) : [];

      // Cleanup expired
      historyChapter = historyChapter.filter(
        (item) => new Date(item.expirationDate).getTime() > now
      );

      const entry = {
        slug,
        timestamp: now,
        expirationDate,
        currentChapter: chapter?.item?.chapter_name,
        currentChapterId: id,
        story,
      };

      const idx = historyChapter.findIndex((item) => item.slug === slug);
      if (idx !== -1) historyChapter[idx] = entry;
      else historyChapter.push(entry);

      localStorage.setItem("historyChapter", JSON.stringify(historyChapter));
    }
  }, [chapter]);

  // ===== PRELOAD NEXT CHAPTER IMAGES =====
  useEffect(() => {
    if (!nextChapterId) return;
    const preloadNextChapter = async () => {
      try {
        const res = await axios.get(
          `https://sv1.otruyencdn.com/v1/api/chapter/${nextChapterId}`
        );
        if (res.data?.data?.item?.chapter_image) {
          const path = res.data.data.item.chapter_path;
          // Preload first 3 images of next chapter
          res.data.data.item.chapter_image.slice(0, 3).forEach((img) => {
            const link = document.createElement("link");
            link.rel = "prefetch";
            link.href = `https://sv1.otruyencdn.com/${path}/${img.image_file}`;
            document.head.appendChild(link);
          });
        }
      } catch (e) { /* silent */ }
    };
    preloadNextChapter();
  }, [nextChapterId]);

  // ===== HANDLERS (useCallback) =====
  const handlePrev = useCallback(() => {
    if (prevChapterId) navigate(`/detail/${slug}/view/${prevChapterId}`);
  }, [prevChapterId, slug, navigate]);

  const handleNext = useCallback(() => {
    if (nextChapterId) navigate(`/detail/${slug}/view/${nextChapterId}`);
  }, [nextChapterId, slug, navigate]);

  const handleChangeChapter = useCallback(
    (e) => navigate(`/detail/${slug}/view/${e.target.value}`),
    [slug, navigate]
  );

  const scrollToTop = useCallback(
    () => window.scrollTo({ top: 0, behavior: "smooth" }),
    []
  );

  const addToFavorites = useCallback(async (e) => {
    e.preventDefault();
    if (!user) { message.warning("Vui lòng đăng nhập để theo dõi truyện"); return; }
    if (!slug || loadingFav) return;
    setLoadingFav(true);
    try {
      await addFavoritesStoryAPI(accessToken, { _id: uuidv4(), slug, story }, userId);
      setIsFavorite(true);
      message.success("Đã thêm vào yêu thích");
    } catch {
      message.error("Thêm thất bại");
    } finally {
      setLoadingFav(false);
    }
  }, [user, slug, loadingFav, accessToken, story, userId]);

  const removeFromFavorites = useCallback((e) => {
    e.preventDefault();
    removeFavoritesStory(accessToken, slug, userId, dispatch);
    setIsFavorite(false);
    message.warning("Đã bỏ theo dõi");
  }, [accessToken, slug, userId, dispatch]);

  const handleReportError = useCallback(async () => {
    if (!isErorr.trim()) { message.warning("Vui lòng nhập nội dung lỗi!"); return; }
    try {
      await addStoryError(userId, user?.username, isErorr, story?.item?.name, accessToken, chapter?.item?.chapter_name || "");
      message.success("Đã gửi lỗi thành công!");
      setIsModalOpen(false);
      setIsErorr("");
    } catch {
      message.error("Gửi lỗi thất bại!");
    }
  }, [isErorr, userId, user, story, accessToken, chapter]);

  // ===== NAV PROPS (shared between header & bottom) =====
  const navProps = {
    chapters: serverData,
    currentId: id,
    slug,
    onPrev: handlePrev,
    onNext: handleNext,
    onChange: handleChangeChapter,
    prevId: prevChapterId,
    nextId: nextChapterId,
  };

  // ===== RENDER =====
  return (
    <div className={isDarkModeEnable ? "bg-[#1a1a2e]" : "bg-[#f0f0f0]"}>
      <Helmet>
        <title>
          {chapter?.item?.comic_name && chapter?.item?.chapter_name
            ? `${chapter.item.comic_name} - Chapter ${chapter.item.chapter_name} - DocTruyen5s`
            : "Đọc truyện - DocTruyen5s"}
        </title>
        <meta
          name="description"
          content={`Đọc ${chapter?.item?.comic_name || "truyện"} Chapter ${chapter?.item?.chapter_name || ""} online miễn phí tại DocTruyen5s.`}
        />
        <meta property="og:title" content={`${chapter?.item?.comic_name || "Truyện"} - Chapter ${chapter?.item?.chapter_name || ""}`} />
        <meta property="og:type" content="article" />
      </Helmet>

      <NavBar />

      <div className="relative">
        {/* ===== HEADER ===== */}
        <header
          className={`${isDarkModeEnable ? "bg-[#16213e] text-gray-200" : "bg-white text-gray-700"
            } mt-4 w-[92%] lg:w-[85%] mx-auto rounded-xl shadow-lg p-5 lg:p-6`}
        >
          {/* Breadcrumb */}
          <nav className="flex flex-wrap gap-1 text-sm text-gray-400">
            <Link to="/" className="hover:text-primary-color transition">Trang chủ</Link>
            <span>&gt;</span>
            <Link to={`/detail/${slug}`} className="hover:text-primary-color transition">
              {chapter?.item?.comic_name}
            </Link>
            <span>&gt;</span>
            <span className="text-primary-color font-medium">
              Chapter {chapter?.item?.chapter_name}
            </span>
          </nav>

          {/* Title */}
          <div className="text-center mt-4">
            <Link to={`/detail/${slug}`} className="hover:text-primary-color transition">
              <h1 className="text-xl lg:text-2xl font-bold">
                {chapter?.item?.comic_name}
              </h1>
            </Link>
            <p className={`text-sm mt-1 ${isDarkModeEnable ? "text-gray-400" : "text-gray-500"}`}>
              Chapter {chapter?.item?.chapter_name}
            </p>
          </div>

          {/* Server notice */}
          <p className={`text-center text-xs mt-3 ${isDarkModeEnable ? "text-gray-500" : "text-gray-400"}`}>
            Nếu không xem được truyện vui lòng đổi "SERVER ẢNH" bên dưới
          </p>

          {/* Server buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <button
              onClick={() => { localStorage.setItem("activeServer", "1"); setActiveServer(1); window.location.reload(); }}
              className={`px-5 py-1.5 rounded-lg text-sm font-bold transition-all shadow-sm ${activeServer === 1
                ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
                : isDarkModeEnable
                  ? "border border-green-500 text-green-400 bg-transparent hover:bg-green-500/10"
                  : "border border-green-500 text-green-600 bg-transparent hover:bg-green-50"
                }`}
            >
              Server 1
            </button>
            <button
              onClick={() => { localStorage.setItem("activeServer", "2"); setActiveServer(2); window.location.reload(); }}
              className={`px-5 py-1.5 rounded-lg text-sm font-bold transition-all shadow-sm ${activeServer === 2
                ? "bg-gradient-to-r from-purple-400 to-purple-500 text-white"
                : isDarkModeEnable
                  ? "border border-purple-500 text-purple-400 bg-transparent hover:bg-purple-500/10"
                  : "border border-purple-500 text-purple-600 bg-transparent hover:bg-purple-50"
                }`}
            >
              Server 2
            </button>
          </div>

          {/* Báo lỗi */}
          <div className="flex justify-center mt-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-all"
            >
              <FontAwesomeIcon icon={faCircleExclamation} className="mr-1.5" />
              Báo lỗi
            </button>
          </div>

          {/* Error Modal */}
          {user ? (
            <Modal
              title="Nhập nội dung lỗi"
              open={isModalOpen}
              onOk={handleReportError}
              onCancel={() => setIsModalOpen(false)}
              okButtonProps={{ className: "bg-blue-500 text-white hover:bg-blue-600" }}
            >
              <Input
                placeholder="Mô tả lỗi bạn gặp phải..."
                value={isErorr}
                onChange={(e) => setIsErorr(e.target.value)}
              />
            </Modal>
          ) : (
            <Modal
              title="Bạn cần đăng nhập để báo lỗi"
              open={isModalOpen}
              onCancel={() => setIsModalOpen(false)}
              footer={null}
            >
              <Link to="/login" className="text-primary-color font-semibold hover:underline">
                Đăng nhập ngay →
              </Link>
            </Modal>
          )}

          {/* Keyboard tip */}
          <div
            className={`mt-4 py-2 px-4 rounded-lg text-center text-xs font-medium ${isDarkModeEnable
              ? "bg-blue-900/30 text-blue-300"
              : "bg-blue-50 text-primary-color"
              }`}
          >
            <FontAwesomeIcon icon={faCircleInfo} className="mr-1.5" />
            Sử dụng phím ← → hoặc nút bấm để chuyển chương
          </div>

          {/* Navigation */}
          <div className="mt-4">
            <ChapterNav {...navProps} variant="header" />
          </div>
        </header>

        {/* ===== CHAPTER IMAGES ===== */}
        <div className="w-full flex flex-col items-center mt-6 mb-20">
          {/* Loading progress */}
          {totalImages > 0 && imagesLoaded < totalImages && (
            <div className={`w-[90%] lg:w-[70%] mb-4 text-center text-sm ${isDarkModeEnable ? "text-gray-400" : "text-gray-500"}`}>
              Đang tải ảnh: {imagesLoaded}/{totalImages}
              <div className={`mt-1 h-1 rounded-full overflow-hidden ${isDarkModeEnable ? "bg-gray-700" : "bg-gray-200"}`}>
                <div
                  className="h-full bg-primary-color rounded-full transition-all duration-300"
                  style={{ width: `${(imagesLoaded / totalImages) * 100}%` }}
                />
              </div>
            </div>
          )}

          {chapterImages.map((img, index) => (
            <img
              key={`${id}-${index}`}
              loading={index < 3 ? "eager" : "lazy"}
              className="w-full max-w-[900px] px-2 lg:px-0 select-none"
              src={`https://sv1.otruyencdn.com/${chapterPath}/${img.image_file}`}
              alt={`${chapter?.item?.comic_name} - Chapter ${chapter?.item?.chapter_name} - Trang ${index + 1}`}
              onLoad={() => setImagesLoaded((prev) => prev + 1)}
              draggable={false}
            />
          ))}

          {/* End-of-chapter navigation */}
          {chapter && (
            <div className={`w-[90%] lg:w-[60%] mt-10 p-6 rounded-2xl text-center ${isDarkModeEnable ? "bg-[#16213e]" : "bg-white shadow-lg"}`}>
              <p className={`text-sm mb-4 ${isDarkModeEnable ? "text-gray-400" : "text-gray-500"}`}>
                — Hết Chapter {chapter?.item?.chapter_name} —
              </p>
              <ChapterNav {...navProps} variant="bottom" />
            </div>
          )}
        </div>

        {/* ===== RECOMMEND + COMMENTS + TAGS ===== */}
        <div className="w-[92%] lg:w-[85%] mx-auto pb-24">

          {/* ===== RECOMMEND ===== */}
          <div className={`mt-10 rounded-xl overflow-hidden ${isDarkModeEnable ? "bg-[#16213e]" : "bg-white shadow-sm border border-gray-100"}`}>
            <div className="py-3 px-5 flex items-center justify-between border-b border-gray-200/50">
              <h3 className="text-base font-bold text-primary-color">
                <FontAwesomeIcon icon={faStar} className="mr-2" />
                Bạn có thể thích
              </h3>
              <div className="flex gap-2">
                <button onClick={() => recommendRef.current && (recommendRef.current.scrollLeft -= 200)} className={`w-8 h-8 rounded-full flex items-center justify-center transition ${isDarkModeEnable ? "bg-[#334155] hover:bg-[#475569] text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}>
                  <FontAwesomeIcon icon={faCaretLeft} />
                </button>
                <button onClick={() => recommendRef.current && (recommendRef.current.scrollLeft += 200)} className={`w-8 h-8 rounded-full flex items-center justify-center transition ${isDarkModeEnable ? "bg-[#334155] hover:bg-[#475569] text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}>
                  <FontAwesomeIcon icon={faCaretRight} />
                </button>
              </div>
            </div>
            <div
              className="p-4 flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
              ref={recommendRef}
              style={{ scrollBehavior: "smooth" }}
            >
              {recommendStories.length > 0 ? (
                recommendStories.map((item) => (
                  <CardStories
                    key={item._id}
                    id={item._id}
                    title={item.name}
                    img={`https://img.otruyenapi.com/uploads/comics/${item.thumb_url}`}
                    slug={item.slug}
                    chapter={item.chaptersLatest?.[0]?.chapter_name}
                    nomarl
                  />
                ))
              ) : (
                <p className="text-gray-400 text-sm py-4 w-full text-center">Không có gợi ý</p>
              )}
            </div>
          </div>

          {/* ===== COMMENTS ===== */}
          <div className={`mt-8 rounded-xl overflow-hidden ${isDarkModeEnable ? "bg-[#16213e]" : "bg-white shadow-sm border border-gray-100"}`}>
            <div className="py-3 px-5 border-b border-gray-200/50">
              <h3 className="text-base font-bold text-primary-color">
                <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
                Bình luận ({comments.length})
              </h3>
            </div>
            <div className="p-5">
              {!user && (
                <div className={`rounded-lg p-4 mb-5 text-sm ${isDarkModeEnable ? "bg-[#0f172a] text-gray-300" : "bg-amber-50 text-amber-800 border border-amber-200"}`}>
                  Bạn cần
                  <Link to="/login" className="font-bold mx-1 underline">Đăng nhập</Link>
                  hoặc
                  <Link to="/register" className="font-bold mx-1 underline">Đăng ký</Link>
                  để bình luận
                </div>
              )}
              {user && (
                <div className="mb-6">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className={`w-full h-28 p-4 rounded-lg border outline-none resize-none text-sm transition ${isDarkModeEnable
                      ? "bg-[#0f172a] border-[#334155] text-gray-200 placeholder-gray-500"
                      : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"
                      } focus:border-primary-color`}
                    placeholder="Nhập bình luận của bạn..."
                  />
                  <button
                    onClick={handleSubmitComment}
                    className="mt-2 px-6 py-2 bg-primary-color text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                    Gửi bình luận
                  </button>
                </div>
              )}
              <div className="space-y-3">
                {loadingComments ? (
                  <p className="text-center py-4 opacity-60 text-sm">Đang tải bình luận...</p>
                ) : comments.length === 0 ? (
                  <p className="text-center py-4 opacity-60 text-sm">Chưa có bình luận nào</p>
                ) : (
                  comments.map((cmt) => (
                    <div
                      key={cmt._id}
                      className={`p-4 rounded-lg ${isDarkModeEnable ? "bg-[#0f172a] border border-[#334155]" : "bg-gray-50 border border-gray-100"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${isDarkModeEnable ? "bg-[#3963C0]" : "bg-primary-color"}`}>
                            {cmt.username?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="font-semibold text-sm">{cmt.username}</span>
                          <span className={`text-xs ${isDarkModeEnable ? "text-gray-500" : "text-gray-400"}`}>
                            {new Date(cmt.createdAt).toLocaleDateString("vi-VN", {
                              day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
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
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ===== TAGS ===== */}
          <div className={`mt-8 rounded-xl overflow-hidden ${isDarkModeEnable ? "bg-[#16213e]" : "bg-white shadow-sm border border-gray-100"}`}>
            <div className="py-3 px-5 border-b border-gray-200/50">
              <h3 className="text-base font-bold text-primary-color">
                <FontAwesomeIcon icon={faTags} className="mr-2" />
                Tags
              </h3>
            </div>
            <div className="p-5">
              <p className={`text-sm leading-relaxed ${isDarkModeEnable ? "text-gray-400" : "text-gray-500"}`}>
                Nettruyen, Truyenqq, Blogtruyen, Manhuavn, Manhwatv, Tiemsachnho,
                Teamlanhlung, Truyentranhaudio, Vlogtruyen, Vcomi, Doctruyen3q,
                Nhattruyen, Truyện tranh, Truyen tranh online, Đọc truyện tranh,
                Truyện tranh hot, Truyện tranh hay, Truyện ngôn tình
              </p>
            </div>
          </div>
        </div>

        {/* ===== FIXED BOTTOM BAR ===== */}
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
        >
          <div className={`${isDarkModeEnable ? "bg-[#16213e]/95 border-t border-[#334155]" : "bg-white/95 border-t border-gray-200"
            } backdrop-blur-md py-2 lg:py-3 px-4 flex justify-center items-center gap-3 lg:gap-5`}
          >
            <Link to="/">
              <button className="py-1.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all">
                <FontAwesomeIcon icon={faHome} />
                <span className="phone:hidden lg:inline ml-1.5">Trang chủ</span>
              </button>
            </Link>

            <ChapterNav {...navProps} variant="bottom" />

            {/* Favorite button */}
            {isFavorite ? (
              <button
                onClick={removeFromFavorites}
                className="py-1.5 px-4 rounded-lg flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition-all"
              >
                <FontAwesomeIcon icon={faHeart} />
                <span className="phone:hidden lg:inline">Bỏ theo dõi</span>
              </button>
            ) : (
              <button
                disabled={!user}
                onClick={addToFavorites}
                className={`py-1.5 px-4 rounded-lg flex items-center gap-1.5 text-sm font-medium transition-all ${!user
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-pink-500 hover:bg-pink-600 text-white"
                  }`}
              >
                <FontAwesomeIcon icon={faHeart} />
                <span className="phone:hidden lg:inline">Theo dõi</span>
              </button>
            )}
          </div>
        </div>

        {/* Scroll to top */}
        <div className={`fixed bottom-20 right-6 z-50 transition-all duration-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}`}>
          <button
            onClick={scrollToTop}
            className={`w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${isDarkModeEnable
              ? "bg-[#334155] text-white hover:bg-[#475569]"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReadStories;
