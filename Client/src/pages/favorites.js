import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import NavBar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectDarkMode } from "../components/layout/DarkModeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faTrash,
  faBookOpen,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import {
  getFavoritesByUser,
  removeFavoritesStory,
} from "../services/apiStoriesRequest";
import { message } from "antd";

const FavoriteStories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isDark = useSelector(selectDarkMode);
  const favorites = useSelector(
    (state) => state.favorite.favorites?.allFavorites
  );
  const user = useSelector((state) => state?.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const userId = user?._id;

  const handleDelete = async (slug) => {
    try {
      await removeFavoritesStory(accessToken, slug, userId, dispatch);
      message.success("Đã bỏ yêu thích");
    } catch {
      message.error("Lỗi server");
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (accessToken) {
      getFavoritesByUser(accessToken, userId, dispatch);
    }
  }, [accessToken, userId]);

  const count = favorites?.length || 0;

  return (
    <div className={isDark ? "bg-bg_dark min-h-screen" : "bg-bg_light min-h-screen"}>
      <NavBar />

      <div className="max-w-[95%] tablet:max-w-[90%] laptop:max-w-[75%] mx-auto py-6">
        {/* Header */}
        <div className={`rounded-xl p-6 mb-6 ${isDark ? "bg-bg_dark_light" : "bg-white shadow-sm"}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faHeart} className="text-white text-xl" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
                Truyện yêu thích
              </h1>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {count} truyện đang theo dõi
              </p>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {count === 0 && (
          <div className={`rounded-xl p-16 text-center ${isDark ? "bg-bg_dark_light" : "bg-white shadow-sm"}`}>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faBook} className="text-gray-300 text-3xl" />
            </div>
            <p className={`text-lg font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Bạn chưa có truyện yêu thích nào
            </p>
            <p className={`text-sm mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Hãy khám phá và thêm truyện yêu thích nhé 📚
            </p>
            <Link to="/">
              <button className="mt-4 px-6 py-2 bg-primary-color text-white rounded-lg text-sm font-medium hover:opacity-90 transition">
                Khám phá truyện
              </button>
            </Link>
          </div>
        )}

        {/* Favorites grid */}
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
          {favorites?.map((item) => {
            const imgSrc = item.story?.seoOnPage?.seoSchema?.image
              || `https://img.otruyenapi.com/uploads/comics/${item.slug}-thumb.jpg`;
            const categories = item.story?.breadCrumb?.slice(1) || [];
            const storyName = item.story?.item?.name || item.slug;

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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
                      {categories.slice(0, 3).map((cate) => (
                        <Link key={cate.slug} to={`/category/${cate.slug}`}>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border transition ${isDark
                            ? "border-[#444] text-gray-400 hover:border-primary-color hover:text-primary-color"
                            : "border-gray-200 text-gray-500 hover:border-primary-color hover:text-primary-color"
                            }`}>
                            {cate.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-2">
                    <Link
                      to={`/detail/${item.slug}`}
                      className="flex items-center gap-1.5 text-xs text-primary-color font-medium hover:underline"
                    >
                      <FontAwesomeIcon icon={faBookOpen} className="text-[11px]" />
                      Đọc ngay
                    </Link>

                    <button
                      onClick={() => handleDelete(item.slug)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition ${isDark
                        ? "text-red-400 hover:bg-red-500/10"
                        : "text-red-500 hover:bg-red-50"
                        }`}
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-[11px]" />
                      Bỏ thích
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FavoriteStories;
