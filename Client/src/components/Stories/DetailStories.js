import React, { useRef, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { NavLink, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { vi } from "date-fns/locale";
import NavBar from "../layout/Navbar";
import Footer from "../layout/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  faStar,
  faCaretRight,
  faCaretLeft,
  faCommentDots,
  faPaperPlane,
  faTags,
  faArrowDown,
  faImage,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import CardStories from "../components/cardStories";
import { useDispatch, useSelector } from "react-redux";
import { selectDarkMode } from "../layout/DarkModeSlice";
import { faFaceSmile } from "@fortawesome/free-regular-svg-icons";
import EmojiPicker from "emoji-picker-react";

import axios from "axios";
import { message } from "antd";
import {
  addFavoritesStoryAPI,
  getDetailStory,
  getFavoritesByUser,
  getLastChapter,
  removeFavoritesStory,
  addComment,
  getCommentsByStory,
  getStorybyCategory,
  getStoryViewCount,
  getNumberSaveStory,
} from "../../services/apiStoriesRequest";

const renderCommentContent = (content, stickerTabs) => {
  if (!content) return null;
  const parts = content.split(/(\[sticker:[^:]+:[^\]]+\]|\[sticker:\d+\])/g);
  return parts.map((part, index) => {
    let match = part.match(/\[sticker:([^:]+):([^\]]+)\]/);
    if (match) {
      const category = match[1];
      const id = match[2];
      const categoryTab = stickerTabs?.find(t => t.category === category);
      const sticker = categoryTab?.stickers?.find(s => s.id === id);
      let url = sticker?.url || `/public/stickers/${category}/${id}.gif`;
      url = url.startsWith('http') ? url : `${process.env.REACT_APP_API_URL}${url}`;
      return (
        <img
          key={index}
          src={url}
          alt={`sticker-${category}-${id}`}
          className="inline-block w-16 h-16 object-contain align-middle mx-1"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="%2364748b">${match[1]} ${match[2]}</text></svg>`;
          }}
        />
      );
    }
    match = part.match(/\[sticker:(\d+)\]/);
    if (match) {
      const categoryTab = stickerTabs?.find(t => t.category === 'troll');
      const sticker = categoryTab?.stickers?.find(s => s.id === match[1]);
      let url = sticker?.url || `/public/stickers/troll/${match[1]}.gif`;
      url = url.startsWith('http') ? url : `${process.env.REACT_APP_API_URL}${url}`;
      return (
        <img
          key={index}
          src={url}
          alt={`sticker-${match[1]}`}
          className="inline-block w-16 h-16 object-contain align-middle mx-1"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="14" font-weight="bold" fill="%2364748b">${match[1]}</text></svg>`;
          }}
        />
      );
    }
    return <span key={index}>{part}</span>;
  });
};

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
  const accessToken = user?.accessToken;
  const userId = user?._id;

  //state
  const [story, setStory] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [readHistory, setReadHistory] = useState(null);
  const [readHistoryChapterId, setReadHistoryChapterId] = useState(null);
  const [loadingFav, setLoadingFav] = useState(false);
  const [comment, setComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [selectedStickers, setSelectedStickers] = useState([]);
  const [stickerTabs, setStickerTabs] = useState([]);
  const [activeStickerTab, setActiveStickerTab] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [recommendStories, setRecommendStories] = useState([]);
  const [storyViewCount, setStoryViewCount] = useState(0);
  const [storyFavCount, setStoryFavCount] = useState(0);
  const [sortAsc, setSortAsc] = useState(false);
  const [averageScore, setAverageScore] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [hoverScore, setHoverScore] = useState(0);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    const fetchStickers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/stickers/all`);
        if (res.data) {
          setStickerTabs(res.data);
          if (res.data.length > 0) setActiveStickerTab(res.data[0].category);
        }
      } catch (e) {
        console.error("Error fetching stickers", e);
      }
    };
    fetchStickers();
  }, []);

  // Fetch view count and fav count for this story
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const viewRes = await getStoryViewCount(slug);
        setStoryViewCount(viewRes?.viewCount || 0);
        const saveRes = await getNumberSaveStory();
        if (saveRes) {
          setStoryFavCount(saveRes[slug] || 0);
        }
      } catch (error) { console.log(error); }
    };
    fetchCounts();
  }, [slug]);

  // Fetch rating data
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const apiURL = process.env.REACT_APP_API_URL;
        const res = await axios.get(`${apiURL}/api/rating/get/${slug}`);
        setAverageScore(res.data?.averageScore || 0);
        setTotalRatings(res.data?.totalRatings || 0);

        if (userId) {
          const userRes = await axios.get(`${apiURL}/api/rating/user/${slug}/${userId}`);
          setUserScore(userRes.data?.userScore || 0);
        }
      } catch (error) { console.log(error); }
    };
    fetchRating();
  }, [slug, userId]);

  const handleRate = async (score) => {
    if (!user) {
      message.warning("Bạn cần đăng nhập để đánh giá");
      return;
    }
    try {
      const apiURL = process.env.REACT_APP_API_URL;
      const res = await axios.post(`${apiURL}/api/rating/rate`, {
        slug,
        userId,
        score,
      });
      setUserScore(res.data.userScore);
      setAverageScore(res.data.averageScore);
      setTotalRatings(res.data.totalRatings);
      message.success(`Đã đánh giá ${score} sao!`);
    } catch (error) {
      console.error(error);
      message.error("Đánh giá thất bại");
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      message.warning("Bạn cần đăng nhập để bình luận");
      return;
    }
    if (!comment.trim() && selectedStickers.length === 0) {
      message.warning("Vui lòng nhập nội dung bình luận hoặc ảnh");
      return;
    }

    const finalComment = comment + selectedStickers.map(s => `[sticker:${s.category}:${s.id}]`).join("");

    try {
      await addComment(accessToken, slug, userId, user.username, finalComment, replyingTo?._id || null);
      message.success("Đã gửi bình luận");
      setComment("");
      setSelectedStickers([]);
      setReplyingTo(null);
      fetchComments();
    } catch (error) {
      message.error("Gửi bình luận thất bại");
    }
  };

  useEffect(() => {
    const fetchReadProgress = async () => {
      setReadHistory(null);
      setReadHistoryChapterId(null);
      try {
        if (userId) {
          const res = await getLastChapter(slug, userId);
          if (res && res.chapter) {
            setReadHistory(res.chapter);
            setReadHistoryChapterId(res.chapterId || null);
            return;
          }
        }
        const localHistory = localStorage.getItem("historyChapter");
        if (localHistory) {
          const parsed = JSON.parse(localHistory);
          const found = parsed.find((item) => item.slug === slug);
          if (found) {
            setReadHistory(found.currentChapter);
            setReadHistoryChapterId(found.currentChapterId || null);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchReadProgress();
  }, [slug, userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDetailStory(slug);
        if (res.data) {
          setStory(res.data.data);
          const categories = res.data.data?.item?.category;
          if (categories && categories.length > 0) {
            try {
              const catSlug = categories[0].slug;
              const catRes = await getStorybyCategory(catSlug);
              if (catRes?.items) {
                const filtered = catRes.items.filter((item) => item.slug !== slug && item.chaptersLatest?.[0]?.chapter_name);
                setRecommendStories(filtered.slice(0, 10));
              }
            } catch (e) { console.log(e); }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    getFavoritesByUser(accessToken, userId, dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, accessToken, userId, dispatch]);

  // Check isFavorite
  useEffect(() => {
    if (favorites && favorites.length > 0) {
      const isFav = favorites.some((fav) => fav.slug === slug);
      setIsFavorite(isFav);
    }
  }, [favorites, slug]);

  const addToFavorites = async (e) => {
    e.preventDefault();
    if (!user) { message.warning("Vui lòng đăng nhập để theo dõi truyện"); return; }
    if (!slug || loadingFav) return;
    setLoadingFav(true);
    try {
      const storyInfo = { _id: uuidv4(), slug, story };
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
    message.warning("Đã bỏ theo dõi");
  };

  const filteredChapters = story.item?.chapters[0]?.server_data?.filter(
    (chap) => chap.chapter_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedChapters = sortAsc ? [...(filteredChapters || [])].reverse() : filteredChapters;

  const containerRef = useRef(null);
  const scroll = (scrollOffset) => {
    containerRef.current.scrollLeft += scrollOffset;
  };

  // time update
  let timeUpdate = "";
  if (story.seoOnPage?.updated_time) {
    const epochTime = story.seoOnPage.updated_time;
    const dateFromEpoch = new Date(epochTime);
    timeUpdate = formatDistanceToNow(dateFromEpoch, { addSuffix: true, locale: vi });
  } else {
    timeUpdate = "N/A";
  }
  const chapterLength = story.item?.chapters[0]?.server_data?.length || 0;
  const hasChapters = chapterLength > 0;

  const currentChapterRef = useRef(null);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    if (readHistory && currentChapterRef.current && !hasScrolledRef.current) {
      hasScrolledRef.current = true;
      setTimeout(() => {
        currentChapterRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [readHistory, filteredChapters]);

  const scrollToCurrentChapter = (e) => {
    e.preventDefault();
    if (currentChapterRef.current) {
      currentChapterRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // ===== INFO ITEMS for sidebar =====
  const infoItems = [
    { icon: faUser, label: "Tác giả", value: story.seoOnPage?.seoSchema?.director || "Đang cập nhật" },
    { icon: faSignal, label: "Trạng thái", value: "Đang tiến hành" },
    { icon: faEye, label: "Lượt xem", value: storyViewCount.toLocaleString() },
    { icon: faHeart, label: "Theo dõi", value: storyFavCount.toLocaleString() },
    { icon: faClock, label: "Đăng vào", value: story?.item?.updatedAt?.slice(0, 10) || "N/A" },
    { icon: faBusinessTime, label: "Cập nhật", value: timeUpdate },
  ];

  return (
    <div className={`${isDarkModeEnable ? "bg-bg_dark" : "bg-bg_light"}`}>
      <Helmet>
        <title>{story.item?.name ? `${story.item.name} - DocTruyen5s` : 'DocTruyen5s'}</title>
        <meta name="description" content={story.seoOnPage?.descriptionHead || `Đọc truyện ${story.item?.name || ''} online miễn phí tại DocTruyen5s`} />
        <meta name="keywords" content={story.item?.category?.map(c => c.name).join(', ') || 'truyện tranh, manga'} />
        <meta property="og:title" content={story.item?.name ? `${story.item.name} - DocTruyen5s` : 'DocTruyen5s'} />
        <meta property="og:description" content={story.seoOnPage?.descriptionHead || `Đọc truyện ${story.item?.name || ''} online miễn phí`} />
        <meta property="og:image" content={`https://img.otruyenapi.com/uploads/comics/${slug}-thumb.jpg`} />
        <meta property="og:type" content="book" />
      </Helmet>
      <NavBar />
      <div className="min-h-screen">

        {/* ===== HERO BANNER ===== */}
        <div className="relative w-full h-[200px] lg:h-[260px] overflow-hidden">
          <img
            src={`https://img.otruyenapi.com/uploads/comics/${slug}-thumb.jpg`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
        </div>

        <div className="max-w-[95%] tablet:max-w-[90%] lg:max-w-[75%] mx-auto -mt-20 lg:-mt-32 relative z-10 pb-8">

          {/* ===== MAIN 2-COLUMN LAYOUT ===== */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ===== LEFT SIDEBAR ===== */}
            <div className="w-full lg:w-[260px] lg:min-w-[260px] flex-shrink-0">
              {/* Cover image - centered on mobile */}
              <div className="flex justify-center lg:block">
                <div className={`rounded-xl overflow-hidden shadow-lg w-[180px] lg:w-full ${isDarkModeEnable ? "shadow-black/30" : "shadow-gray-300"}`}>
                  <img
                    className="w-full h-[260px] lg:h-[360px] object-cover"
                    src={`https://img.otruyenapi.com/uploads/comics/${slug}-thumb.jpg`}
                    alt={story.item?.name || "Ảnh bìa truyện"}
                  />
                </div>
              </div>

              {/* Rating */}
              <div className={`mt-3 w-full p-3 rounded-xl ${isDarkModeEnable ? "bg-[#1e293b]" : "bg-white shadow-sm border border-gray-100"}`}>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesomeIcon
                      key={star}
                      icon={faStar}
                      className={`text-lg cursor-pointer transition-all duration-150 ${(hoverScore || userScore) >= star
                        ? "text-yellow-400 scale-110"
                        : averageScore >= star
                          ? "text-yellow-300/60"
                          : averageScore >= star - 0.5
                            ? "text-yellow-300/30"
                            : isDarkModeEnable ? "text-gray-600" : "text-gray-300"
                        }`}
                      onMouseEnter={() => setHoverScore(star)}
                      onMouseLeave={() => setHoverScore(0)}
                      onClick={() => handleRate(star)}
                    />
                  ))}
                </div>
                <div className="text-center mt-1.5">
                  <span className={`text-sm font-bold ${isDarkModeEnable ? "text-yellow-400" : "text-yellow-500"}`}>
                    {averageScore > 0 ? averageScore.toFixed(1) : "—"}
                  </span>
                  <span className={`text-xs ml-1 ${isDarkModeEnable ? "text-gray-400" : "text-gray-500"}`}>
                    / 5 ({totalRatings} đánh giá)
                  </span>
                </div>
                {userScore > 0 && (
                  <p className={`text-center text-[11px] mt-1 ${isDarkModeEnable ? "text-gray-500" : "text-gray-400"}`}>
                    Bạn đã đánh giá {userScore} ⭐
                  </p>
                )}
              </div>

              {/* Read button */}
              {hasChapters ? (
                <Link
                  to={
                    readHistoryChapterId
                      ? `view/${readHistoryChapterId}`
                      : `view/${story.item?.chapters[0]?.server_data[0]?.chapter_api_data?.split("/").pop()}`
                  }
                >
                  <button className="mt-4 w-full py-3 rounded-lg uppercase font-bold text-white bg-primary-color hover:opacity-90 transition text-sm tracking-wide">
                    {readHistory ? `ĐỌC TIẾP CH.${readHistory}` : "ĐỌC NGAY"}
                  </button>
                </Link>
              ) : (
                <button disabled className="mt-4 w-full py-3 rounded-lg uppercase font-bold bg-gray-400 text-white cursor-not-allowed text-sm">
                  Chưa có chương
                </button>
              )}

              {/* Story info */}
              <div className={`mt-4 rounded-xl p-4 space-y-3 text-sm ${isDarkModeEnable ? "bg-[#1e293b]" : "bg-white shadow-sm border border-gray-100"}`}>
                {infoItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className={`flex items-center gap-2 ${isDarkModeEnable ? "text-gray-400" : "text-gray-500"}`}>
                      <FontAwesomeIcon icon={item.icon} className="w-4 text-center" />
                      {item.label}
                    </span>
                    <span className={`font-medium text-right max-w-[180px] truncate ${isDarkModeEnable ? "text-gray-200" : "text-gray-700"}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ===== RIGHT CONTENT ===== */}
            <div className="flex-1 min-w-0">
              <div className={`rounded-xl p-4 lg:p-6 ${isDarkModeEnable ? "bg-[#1e293b]" : "bg-white shadow-sm border border-gray-100"}`}>

                {/* Title */}
                <h1 className={`text-xl lg:text-2xl font-bold ${isDarkModeEnable ? "text-white" : "text-gray-800"}`}>
                  {story.item?.name}
                </h1>
                {story.seoOnPage?.seoSchema?.name && (
                  <p className={`text-sm mt-1 ${isDarkModeEnable ? "text-gray-400" : "text-gray-500"}`}>
                    Tên khác: {story.seoOnPage.seoSchema.name}
                  </p>
                )}

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {story.item?.category?.map((cate) => {
                    const idx = Math.floor(Math.random() * 10);
                    const colorClass = isDarkModeEnable
                      ? [
                        "bg-red-900/30 text-red-300 hover:bg-red-900/50",
                        "bg-green-900/30 text-green-300 hover:bg-green-900/50",
                        "bg-blue-900/30 text-blue-300 hover:bg-blue-900/50",
                        "bg-yellow-900/30 text-yellow-300 hover:bg-yellow-900/50",
                        "bg-purple-900/30 text-purple-300 hover:bg-purple-900/50",
                        "bg-pink-900/30 text-pink-300 hover:bg-pink-900/50",
                        "bg-indigo-900/30 text-indigo-300 hover:bg-indigo-900/50",
                        "bg-emerald-900/30 text-emerald-300 hover:bg-emerald-900/50",
                        "bg-amber-900/30 text-amber-300 hover:bg-amber-900/50",
                        "bg-cyan-900/30 text-cyan-300 hover:bg-cyan-900/50",
                      ][idx]
                      : [
                        "bg-red-200 text-red-800 hover:bg-red-300",
                        "bg-green-200 text-green-800 hover:bg-green-300",
                        "bg-blue-200 text-blue-800 hover:bg-blue-300",
                        "bg-yellow-200 text-yellow-800 hover:bg-yellow-300",
                        "bg-purple-200 text-purple-800 hover:bg-purple-300",
                        "bg-pink-200 text-pink-800 hover:bg-pink-300",
                        "bg-indigo-200 text-indigo-800 hover:bg-indigo-300",
                        "bg-emerald-200 text-emerald-800 hover:bg-emerald-300",
                        "bg-amber-200 text-amber-800 hover:bg-amber-300",
                        "bg-cyan-200 text-cyan-800 hover:bg-cyan-300",
                      ][idx];
                    return (
                      <NavLink to={`/category/${cate.slug}`} key={cate.id}>
                        <span className={`inline-block text-xs px-3 py-1 rounded-md font-medium transition-all shadow-sm ${colorClass}`}>
                          {cate.name}
                        </span>
                      </NavLink>
                    );
                  })}
                </div>

                {/* Action buttons */}
                <div className="mt-5">
                  {/* Mobile: 2-col grid + follow below. Tablet+: all 3 in one row */}
                  <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-3">
                    <Link
                      to={hasChapters
                        ? `view/${story.item?.chapters[0]?.server_data[0]?.chapter_api_data?.split("/").pop()}`
                        : "#"
                      }
                      className={`flex items-center justify-center gap-2 h-10 px-4 rounded-lg font-medium text-white text-sm transition ${hasChapters ? "bg-[#4CAF50] hover:bg-[#43A047]" : "bg-gray-400 cursor-not-allowed"}`}
                    >
                      <FontAwesomeIcon icon={faBook} />
                      Bắt đầu đọc
                    </Link>

                    <Link
                      to={hasChapters
                        ? `view/${story.item?.chapters[0]?.server_data[chapterLength - 1]?.chapter_api_data?.split("/").pop()}`
                        : "#"
                      }
                      className={`flex items-center justify-center gap-2 h-10 px-4 rounded-lg font-medium text-white text-sm transition ${hasChapters
                        ? isDarkModeEnable ? "bg-[#7B1FA2] hover:bg-[#9C27B0]" : "bg-[#BD10E0] hover:bg-[#D360EA]"
                        : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                      <FontAwesomeIcon icon={faBookTanakh} />
                      Chương mới nhất
                    </Link>

                    {isFavorite ? (
                      <button
                        onClick={removeFromFavorites}
                        className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 h-10 px-8 rounded-lg font-medium text-sm border-2 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white transition"
                      >
                        <FontAwesomeIcon icon={faHeart} />
                        Bỏ theo dõi
                      </button>
                    ) : (
                      <button
                        disabled={!user}
                        onClick={addToFavorites}
                        className={`col-span-2 sm:col-span-1 flex items-center justify-center gap-2 h-10 px-8 rounded-lg font-medium text-sm border-2 transition ${!user ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"}`}
                      >
                        <FontAwesomeIcon icon={faHeart} />
                        Theo dõi
                      </button>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h2 className={`font-bold text-base mb-2 ${isDarkModeEnable ? "text-gray-200" : "text-gray-700"}`}>Giới thiệu</h2>
                  <p className={`text-sm leading-7 text-justify ${isDarkModeEnable ? "text-gray-300" : "text-gray-600"}`}>
                    {story.seoOnPage?.descriptionHead}
                  </p>
                </div>

                {/* ===== CHAPTER LIST ===== */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`font-bold text-base ${isDarkModeEnable ? "text-gray-200" : "text-gray-700"}`}>
                      <FontAwesomeIcon icon={faBookOpen} className="mr-2 text-primary-color" />
                      Danh sách chương
                    </h3>
                    <div className="flex items-center gap-2">
                      {readHistory && (
                        <button
                          onClick={scrollToCurrentChapter}
                          className="text-xs px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                          Ch.{readHistory}
                        </button>
                      )}
                      <button
                        onClick={() => setSortAsc(!sortAsc)}
                        className={`p-1.5 rounded-md text-xs transition ${isDarkModeEnable ? "bg-[#334155] text-gray-300 hover:bg-[#475569]" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                        title={sortAsc ? "Mới nhất trước" : "Cũ nhất trước"}
                      >
                        <FontAwesomeIcon icon={faArrowDown} className={`transition-transform ${sortAsc ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  </div>

                  <input
                    className={`w-full h-10 px-4 mb-4 rounded-lg border outline-none text-sm transition ${isDarkModeEnable
                      ? "bg-[#0f172a] border-[#334155] text-gray-200 placeholder-gray-500"
                      : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"
                      }`}
                    placeholder="Tìm chương..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                    {sortedChapters?.map((chap) => {
                      const isCurrentChapter = parseInt(readHistory) === parseInt(chap.chapter_name);
                      const chapTime = chap.chapter_title || "";

                      return (
                        <Link key={chap.chapter_name} to={`view/${chap.chapter_api_data.split("/").pop()}`}>
                          <div
                            ref={isCurrentChapter ? currentChapterRef : null}
                            className={`relative p-3 rounded-lg border text-center transition-all duration-200 group
                              ${isCurrentChapter
                                ? isDarkModeEnable
                                  ? "bg-blue-600 text-white border-blue-500 ring-2 ring-blue-400/50 font-semibold"
                                  : "bg-blue-500 text-white border-blue-400 ring-2 ring-blue-200 font-semibold shadow-md"
                                : isDarkModeEnable
                                  ? "border-[#334155] hover:bg-[#334155] hover:border-blue-500/50 text-gray-300"
                                  : "border-gray-200 hover:bg-blue-50 hover:border-primary-color text-gray-600"
                              }`}
                          >
                            {isCurrentChapter && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] bg-yellow-400 text-yellow-900 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                Đang đọc
                              </span>
                            )}
                            <p className="text-sm font-medium">Chapter {chap.chapter_name}</p>
                            {chapTime && (
                              <p className={`text-[10px] mt-1 ${isCurrentChapter ? "text-blue-100" : isDarkModeEnable ? "text-gray-500" : "text-gray-400"}`}>
                                {chapTime}
                              </p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== RECOMMEND ===== */}
          <div className={`mt-10 rounded-xl overflow-hidden ${isDarkModeEnable ? "bg-[#1e293b]" : "bg-white shadow-sm border border-gray-100"}`}>
            <div className="py-3 px-5 flex items-center justify-between border-b border-gray-200/50">
              <h3 className="text-base font-bold text-primary-color">
                <FontAwesomeIcon icon={faStar} className="mr-2" />
                Bạn có thể thích
              </h3>
              <div className="flex gap-2">
                <button onClick={() => scroll(-200)} className={`w-8 h-8 rounded-full flex items-center justify-center transition ${isDarkModeEnable ? "bg-[#334155] hover:bg-[#475569] text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}>
                  <FontAwesomeIcon icon={faCaretLeft} />
                </button>
                <button onClick={() => scroll(200)} className={`w-8 h-8 rounded-full flex items-center justify-center transition ${isDarkModeEnable ? "bg-[#334155] hover:bg-[#475569] text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}>
                  <FontAwesomeIcon icon={faCaretRight} />
                </button>
              </div>
            </div>
            <div
              className="p-4 flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
              ref={containerRef}
              style={{ scrollBehavior: "smooth" }}
            >
              {recommendStories.length > 0 ? (
                recommendStories.map((item) => (
                  <div key={item._id} className="w-[120px] shrink-0">
                    <CardStories
                      id={item._id}
                      title={item.name}
                      img={`https://img.otruyenapi.com/uploads/comics/${item.thumb_url}`}
                      slug={item.slug}
                      chapter={item.chaptersLatest?.[0]?.chapter_name}
                      nomarl
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm py-4 w-full text-center">Không có gợi ý</p>
              )}
            </div>
          </div>

          {/* ===== COMMENTS ===== */}
          <div className={`mt-8 rounded-xl ${isDarkModeEnable ? "bg-[#1e293b]" : "bg-white shadow-sm border border-gray-100"}`}>
            <div className="py-3 px-5 border-b border-gray-200/50">
              <h3 className="text-base font-bold text-primary-color">
                <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
                Bình luận ({comments.length})
              </h3>
            </div>

            <div className="p-5">
              {/* Not logged in */}
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
                  {replyingTo && (
                    <div className="flex items-center justify-between mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                      <span>Đang trả lời: <strong>{replyingTo.username}</strong></span>
                      <button onClick={() => setReplyingTo(null)} className="text-blue-500 hover:text-blue-800">
                        <FontAwesomeIcon icon={faXmark} /> Huỷ
                      </button>
                    </div>
                  )}
                  <div className={`relative flex flex-col rounded-lg border transition ${isDarkModeEnable
                    ? "bg-[#0f172a] border-[#334155]"
                    : "bg-gray-50 border-gray-200"
                    } focus-within:border-primary-color`}>
                    <textarea
                      id="commentTextarea"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className={`w-full min-h-[112px] p-4 pb-12 pr-20 bg-transparent outline-none resize-none text-sm rounded-lg transition ${isDarkModeEnable
                        ? "text-gray-200 placeholder-gray-500"
                        : "text-gray-700 placeholder-gray-400"
                        }`}
                      placeholder="Nhập bình luận hoặc gửi nhãn dán..."
                    />

                    {selectedStickers.length > 0 && (
                      <div className="px-4 pb-14 flex flex-wrap gap-2">
                        {selectedStickers.map((st, idx) => {
                          const categoryTab = stickerTabs?.find(t => t.category === st.category);
                          const stickerObj = categoryTab?.stickers?.find(s => s.id === st.id);
                          let url = stickerObj?.url || `/public/stickers/${st.category}/${st.id}.gif`;
                          url = url.startsWith('http') ? url : `${process.env.REACT_APP_API_URL}${url}`;
                          return (
                            <div key={idx} className="relative group inline-block">
                              <img src={url} alt="sticker" className={`w-16 h-16 object-contain border rounded-lg ${isDarkModeEnable ? "bg-[#1e293b] border-[#334155]" : "bg-white border-gray-200"}`} />
                              <button
                                onClick={() => setSelectedStickers(prev => prev.filter((_, i) => i !== idx))}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FontAwesomeIcon icon={faXmark} />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-transparent">
                      <button
                        onClick={() => { setShowStickerPicker(!showStickerPicker); setShowEmojiPicker(false); }}
                        className={`p-1.5 rounded-full transition-all flex items-center justify-center ${isDarkModeEnable ? "text-gray-400 hover:text-gray-200 hover:bg-[#334155]" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"}`}
                        title="Thêm sticker"
                      >
                        <FontAwesomeIcon icon={faImage} className="text-xl" />
                      </button>
                      <button
                        onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowStickerPicker(false); }}
                        className={`p-1.5 rounded-full transition-all flex items-center justify-center ${isDarkModeEnable ? "text-gray-400 hover:text-gray-200 hover:bg-[#334155]" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"}`}
                        title="Thêm emoji"
                      >
                        <FontAwesomeIcon icon={faFaceSmile} className="text-xl" />
                      </button>
                    </div>

                    {showStickerPicker && (
                      <div className={`absolute top-full right-0 mt-2 z-50 rounded-lg shadow-2xl border w-[320px] sm:w-[400px] h-[350px] flex flex-col overflow-hidden ${isDarkModeEnable ? "bg-[#1e293b] border-[#334155]" : "bg-white border-gray-200"}`}>
                        <div className="bg-[#4a85f6] text-white px-3 py-2 flex justify-between items-center shrink-0">
                          <span className="font-semibold text-sm">Emojis</span>
                          <button onClick={() => setShowStickerPicker(false)} className="hover:opacity-80">
                            <FontAwesomeIcon icon={faXmark} />
                          </button>
                        </div>
                        <div className={`flex gap-1 p-2 border-b overflow-x-auto shrink-0 scrollbar-hide ${isDarkModeEnable ? "border-[#334155]" : "border-gray-200"}`}>
                          {stickerTabs.map(tab => (
                            <button
                              key={tab._id}
                              onClick={() => setActiveStickerTab(tab.category)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded whitespace-nowrap transition ${activeStickerTab === tab.category
                                ? "bg-[#4a85f6] text-white"
                                : isDarkModeEnable
                                  ? "bg-[#334155] text-gray-300 hover:bg-[#475569]"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 grid grid-cols-4 sm:grid-cols-5 gap-2 content-start">
                          {stickerTabs.find(t => t.category === activeStickerTab)?.stickers.map((sticker) => (
                            <button
                              key={sticker.id}
                              onClick={() => {
                                setSelectedStickers((prev) => [...prev, { category: activeStickerTab, id: sticker.id }]);
                                setShowStickerPicker(false);
                              }}
                              className={`p-1 flex items-center justify-center rounded transition-all hover:scale-110 ${isDarkModeEnable ? "hover:bg-[#334155]" : "hover:bg-gray-100"}`}
                            >
                              <img
                                src={sticker.url.startsWith('http') ? sticker.url : `${process.env.REACT_APP_API_URL}${sticker.url}`}
                                alt={`sticker-${activeStickerTab}-${sticker.id}`}
                                className="w-12 h-12 object-contain"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="%23cbd5e1"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="14" font-weight="bold" fill="%23475569">${sticker.id}</text></svg>`;
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {showEmojiPicker && (
                      <div className="absolute top-full right-0 mt-1 z-50 shadow-2xl rounded-lg">
                        <EmojiPicker
                          onEmojiClick={(emojiObject) => {
                            setComment((prev) => prev + emojiObject.emoji);
                          }}
                          theme={isDarkModeEnable ? "dark" : "light"}
                          previewConfig={{ showPreview: false }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleSubmitComment}
                      className="px-6 py-2 bg-primary-color text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
                    >
                      <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                      Gửi bình luận
                    </button>
                  </div>
                </div>
              )}

              {/* Comment list */}
              <div className="space-y-3">
                {loadingComments ? (
                  <p className="text-center py-4 opacity-60 text-sm">Đang tải bình luận...</p>
                ) : comments.length === 0 ? (
                  <p className="text-center py-4 opacity-60 text-sm">Chưa có bình luận nào</p>
                ) : (
                  comments.filter(c => !c.parentId).map((cmt) => (
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
                        <div className="flex gap-3 items-center">
                          {user && (
                            <button
                              onClick={() => {
                                setReplyingTo({ _id: cmt._id, username: cmt.username });
                                document.getElementById('commentTextarea')?.focus();
                              }}
                              className="text-xs text-blue-500 hover:text-blue-700 transition font-medium"
                            >
                              Trả lời
                            </button>
                          )}
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
                      </div>
                      <div className="text-sm leading-relaxed pl-10 whitespace-pre-wrap">{renderCommentContent(cmt.content, stickerTabs)}</div>

                      {/* Sub-comments (Replies) */}
                      {comments.filter(sub => sub.parentId === cmt._id).length > 0 && (
                        <div className={`mt-3 pl-4 sm:pl-10 space-y-3 border-l-2 ${isDarkModeEnable ? "border-[#334155]" : "border-gray-200"}`}>
                          {comments.filter(sub => sub.parentId === cmt._id).map((subCmt) => (
                            <div key={subCmt._id} className="pt-2">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${isDarkModeEnable ? "bg-[#713f96]" : "bg-purple-500"}`}>
                                    {subCmt.username?.charAt(0)?.toUpperCase()}
                                  </div>
                                  <span className="font-semibold text-xs">{subCmt.username}</span>
                                  <span className={`text-[11px] ${isDarkModeEnable ? "text-gray-500" : "text-gray-400"}`}>
                                    {new Date(subCmt.createdAt).toLocaleDateString("vi-VN", {
                                      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <div className="flex gap-3 items-center">
                                  {user && (
                                    <button
                                      onClick={() => {
                                        setReplyingTo({ _id: cmt._id, username: subCmt.username });
                                        document.getElementById('commentTextarea')?.focus();
                                      }}
                                      className="text-xs text-blue-500 hover:text-blue-700 transition font-medium"
                                    >
                                      Trả lời
                                    </button>
                                  )}
                                  {user && (user._id === subCmt.userId || user.admin) && (
                                    <button
                                      onClick={async () => {
                                        try {
                                          await axios.delete(
                                            `${process.env.REACT_APP_API_URL}/api/comment/delete/${subCmt._id}`,
                                            { headers: { token: `Bearer ${accessToken}` } }
                                          );
                                          message.success("Đã xoá bình luận");
                                          fetchComments();
                                        } catch (err) {
                                          message.error("Xoá thất bại");
                                        }
                                      }}
                                      className="text-[11px] text-red-500 hover:text-red-700 transition"
                                    >
                                      Xoá
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="text-sm leading-relaxed pl-8 whitespace-pre-wrap">{renderCommentContent(subCmt.content, stickerTabs)}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ===== TAGS ===== */}
          <div className={`mt-8 rounded-xl overflow-hidden ${isDarkModeEnable ? "bg-[#1e293b]" : "bg-white shadow-sm border border-gray-100"}`}>
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
      </div>
      <Footer />
    </div>
  );
};

export default DetailStories;
