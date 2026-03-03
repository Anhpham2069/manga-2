import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../components/layout/DarkModeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClockRotateLeft,
  faBookOpen,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { getHistoryByUser } from "../services/apiStoriesRequest";

const History = () => {
  const isDark = useSelector(selectDarkMode);
  const user = useSelector((state) => state?.auth.login.currentUser);
  const userId = user?._id;
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      try {
        if (userId) {
          const data = await getHistoryByUser(userId);
          setHistory(data || []);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId, user, navigate]);

  const count = history.length;

  return (
    <div className={isDark ? "bg-bg_dark min-h-screen" : "bg-bg_light min-h-screen"}>
      <Helmet>
        <title>Lịch sử đọc truyện - DocTruyen5s</title>
        <meta name="description" content="Xem lại lịch sử đọc truyện của bạn tại DocTruyen5s." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <NavBar />

      <div className="max-w-[95%] tablet:max-w-[90%] laptop:max-w-[75%] mx-auto py-6">
        {/* Header */}
        <div className={`rounded-xl p-6 mb-6 ${isDark ? "bg-bg_dark_light" : "bg-white shadow-sm"}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faClockRotateLeft} className="text-white text-xl" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
                Lịch sử đọc truyện
              </h1>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {count} truyện đã đọc
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className={`rounded-xl p-16 text-center ${isDark ? "bg-bg_dark_light" : "bg-white shadow-sm"}`}>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Đang tải...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && count === 0 && (
          <div className={`rounded-xl p-16 text-center ${isDark ? "bg-bg_dark_light" : "bg-white shadow-sm"}`}>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faBook} className="text-gray-300 text-3xl" />
            </div>
            <p className={`text-lg font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Bạn chưa có lịch sử đọc truyện nào
            </p>
            <p className={`text-sm mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Hãy bắt đầu đọc truyện nhé 📚
            </p>
            <Link to="/">
              <button className="mt-4 px-6 py-2 bg-primary-color text-white rounded-lg text-sm font-medium hover:opacity-90 transition">
                Khám phá truyện
              </button>
            </Link>
          </div>
        )}

        {/* History grid */}
        {!loading && count > 0 && (
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
            {history.map((item) => {
              let timeAgo = "";
              try {
                timeAgo = formatDistanceToNow(new Date(item.timestamp), {
                  addSuffix: true,
                  locale: vi,
                });
                timeAgo = timeAgo.replace(/^khoảng\s/, "");
              } catch {
                timeAgo = "";
              }

              const imgSrc = item.storyInfo?.seoOnPage?.seoSchema?.image
                || `https://img.otruyenapi.com/uploads/comics/${item.slug}-thumb.jpg`;
              const storyName = item.storyInfo?.item?.name || item.slug;
              const categories = item.storyInfo?.breadCrumb?.slice(1) || [];

              return (
                <div
                  key={item._id}
                  className={`group flex gap-4 p-4 rounded-xl transition-all duration-300 hover:shadow-lg ${isDark
                    ? "bg-bg_dark_light hover:bg-[#2a2b2d]"
                    : "bg-white shadow-sm hover:shadow-md"
                    }`}
                >
                  {/* Cover */}
                  <Link to={`/detail/${item.slug}`} className="shrink-0">
                    <div className="relative w-[90px] h-[120px] rounded-lg overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={storyName}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {/* Chapter badge */}
                      <div className="absolute bottom-0 left-0 right-0 bg-primary-color/90 text-white text-[10px] font-bold text-center py-0.5">
                        Ch. {item.chapter}
                      </div>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
                    <div>
                      <Link to={`/detail/${item.slug}`}>
                        <h3 className={`font-bold text-[15px] leading-tight line-clamp-2 transition ${isDark
                          ? "text-gray-200 hover:text-primary-color"
                          : "text-gray-800 hover:text-primary-color"
                          }`}>
                          {storyName}
                        </h3>
                      </Link>

                      {/* Categories */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {categories.slice(0, 3).map((cate, idx) => (
                          <Link key={idx} to={`/category/${cate.slug}`}>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border transition ${isDark
                              ? "border-[#444] text-gray-400 hover:border-primary-color hover:text-primary-color"
                              : "border-gray-200 text-gray-500 hover:border-primary-color hover:text-primary-color"
                              }`}>
                              {cate?.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-2">
                      {item.chapterId ? (
                        <Link
                          to={`/detail/${item.slug}/view/${item.chapterId}`}
                          className="flex items-center gap-1.5 text-xs text-primary-color font-medium hover:underline"
                        >
                          <FontAwesomeIcon icon={faBookOpen} className="text-[11px]" />
                          Đọc tiếp Ch. {item.chapter}
                        </Link>
                      ) : (
                        <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                          Đã đọc Ch. {item.chapter}
                        </span>
                      )}

                      {timeAgo && (
                        <span className={`text-[11px] italic ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                          {timeAgo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default History;