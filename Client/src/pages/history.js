import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../components/layout/DarkModeSlice";
import { getHistoryByUser } from "../services/apiStoriesRequest";

const History = () => {
  const isDarkModeEnable = useSelector(selectDarkMode);
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
          // Lấy lịch sử từ server theo userId
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

  return (
    <div>
      <Helmet>
        <title>Lịch sử đọc truyện - DocTruyen5s</title>
        <meta name="description" content="Xem lại lịch sử đọc truyện của bạn tại DocTruyen5s. Tiếp tục đọc từ nơi bạn dừng lại." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <NavBar />
      <div className="p-5 bg-bg_light min-h-screen">
        <h2 className="font-bold text-3xl border-b-2 bg-white p-5 text-primary-color rounded-md shadow-sm">
          Lịch sử đọc truyện
        </h2>
        <div className="p-5 bg-white flex flex-col gap-2 mt-4 rounded-md shadow-sm">
          {loading ? (
            <p className="text-center text-gray-500 py-10">Đang tải...</p>
          ) : history.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              Bạn chưa có lịch sử đọc truyện nào 📚
            </p>
          ) : (
            history.map((item) => {
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

              return (
                <div
                  key={item._id}
                  className={`flex w-full p-3 justify-between items-center relative border-b-2 ${isDarkModeEnable ? "bg-bg_dark_light" : ""
                    }`}
                >
                  <div className="flex gap-5 h-full w-full">
                    <div className="relative h-full flex shrink-0">
                      <Link to={`/detail/${item.slug}`}>
                        <img
                          src={item.storyInfo?.seoOnPage?.seoSchema?.image}
                          alt="anh"
                          className="w-24 h-32 object-cover rounded-lg"
                        />
                      </Link>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <Link to={`/detail/${item.slug}`}>
                        <p
                          className={`${isDarkModeEnable ? "text-[#8a8282]" : "text-black"
                            } phone:text-sm font-bold tablet:text-xl hover:text-primary-color transition`}
                        >
                          {item.storyInfo?.item?.name}
                        </p>
                      </Link>
                      <div className="flex flex-wrap gap-1">
                        {item.storyInfo?.breadCrumb?.slice(1).map((cate, idx) => (
                          <Link key={idx} to={`/category/${cate.slug}`}>
                            <span className="text-xs px-2 py-1 border rounded-full hover:bg-primary-color hover:text-white transition">
                              {cate?.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-500">
                          Đã đọc chapter: <span className="text-primary-color font-semibold">{item.chapter}</span>
                        </p>
                        {item.chapterId && (
                          <Link to={`/detail/${item.slug}/view/${item.chapterId}`}>
                            <p className="font-medium text-sm text-primary-color hover:underline">
                              Đọc tiếp chapter {item.chapter} →
                            </p>
                          </Link>
                        )}
                      </div>
                      {timeAgo && (
                        <p className="text-xs text-gray-400 italic">{timeAgo}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default History;