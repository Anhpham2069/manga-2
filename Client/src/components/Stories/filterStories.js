import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../layout/DarkModeSlice";
import CardStories from "../components/cardStories";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faSearch,
  faRotateRight,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import NavBar from "../layout/Navbar";
import Footer from "../layout/footer";
import axios from "axios";
import { getAllCategory } from "../../services/apiStoriesRequest";
import PopularSection from "./PopularSection";

const apiURLOTruyen = process.env.REACT_APP_API_URL_OTruyen;

const FilterStories = () => {
  const darkMode = useSelector(selectDarkMode);

  // Genres data
  const [genres, setGenres] = useState([]);

  // Filter state
  const [selectedGenre, setSelectedGenre] = useState("");
  const [minChapters, setMinChapters] = useState(0);
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [keyword, setKeyword] = useState("");

  // Results state
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      const res = await getAllCategory();
      if (res) {
        setGenres(res.items || []);
      }
    };
    fetchGenres();
  }, []);

  // Fetch stories when filters change
  useEffect(() => {
    fetchStories();
  }, [selectedGenre, currentPage]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      let url = "";
      if (selectedGenre) {
        url = `${apiURLOTruyen}/the-loai/${selectedGenre}?page=${currentPage}`;
      } else if (keyword.trim()) {
        url = `https://otruyenapi.com/v1/api/tim-kiem?keyword=${keyword}&page=${currentPage}`;
      } else {
        url = `${apiURLOTruyen}/danh-sach/truyen-moi?page=${currentPage}`;
      }

      const res = await axios.get(url);
      if (res.data?.data) {
        let items = res.data.data.items || [];
        const pagination = res.data.data.params?.pagination;

        // Client-side filters
        // Filter by min chapters
        if (minChapters > 0) {
          items = items.filter((item) => {
            const chapterCount = item.chaptersLatest?.[0]?.chapter_name
              ? parseInt(item.chaptersLatest[0].chapter_name)
              : 0;
            return chapterCount >= minChapters;
          });
        }

        // Filter by status
        if (status !== "all") {
          items = items.filter((item) => {
            const storyStatus = item.status || "";
            if (status === "completed") return storyStatus === "completed";
            if (status === "on-going") return storyStatus === "ongoing";
            return true;
          });
        }

        // Sort
        if (sortBy === "az") {
          items.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "za") {
          items.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortBy === "new") {
          items.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );
        } else if (sortBy === "old") {
          items.sort(
            (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
          );
        }

        setResults(items);
        setTotalPages(
          pagination
            ? Math.ceil(
              pagination.totalItems /
              (pagination.totalItemsPerPage || 24)
            )
            : 1
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    setSelectedGenre("");
    setCurrentPage(1);
    fetchStories();
  };

  const handleGenreClick = (slug) => {
    setSelectedGenre(slug);
    setKeyword("");
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSelectedGenre("");
    setMinChapters(0);
    setStatus("all");
    setSortBy("default");
    setKeyword("");
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchStories();
  };

  const cardBg = darkMode
    ? "bg-bg_dark_light text-text_darkMode"
    : "bg-white";
  const selectClass = `py-2 px-3 border rounded-lg w-[55%] outline-none transition ${darkMode
    ? "bg-[#252A34] border-[#3a3f4b] text-text_darkMode"
    : "bg-white border-gray-300"
    }`;

  return (
    <div
      className={`${darkMode ? "bg-bg_dark text-text_darkMode" : "bg-bg_light"
        } min-h-screen`}
    >
      <Helmet>
        <title>Tìm kiếm nâng cao - DocTruyen5s</title>
        <meta name="description" content="Tìm kiếm và lọc truyện theo thể loại, trạng thái, số chương. Tìm truyện tranh yêu thích của bạn tại DocTruyen5s." />
        <meta property="og:title" content="Tìm kiếm nâng cao - DocTruyen5s" />
        <meta property="og:description" content="Tìm kiếm và lọc truyện theo thể loại, trạng thái, số chương tại DocTruyen5s." />
        <meta property="og:type" content="website" />
      </Helmet>
      <NavBar />
      <div className="max-w-full tablet:max-w-[90%] lg:max-w-[75%] mt-6 mx-auto px-2 tablet:px-0">
        {/* Main Content */}
        <div className={`${cardBg} w-full p-5 rounded-xl shadow-lg`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
            <h2 className="text-xl font-bold text-primary-color flex items-center gap-2">
              <FontAwesomeIcon icon={faFilter} />
              Tìm kiếm nâng cao
            </h2>
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-primary-color transition flex items-center gap-1"
            >
              <FontAwesomeIcon icon={faRotateRight} /> Đặt lại
            </button>
          </div>

          {/* Keyword Search */}
          <form onSubmit={handleSearch} className="mb-5">
            <div className="relative">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm truyện theo tên..."
                className={`w-full h-11 pl-10 pr-4 rounded-lg border outline-none transition ${darkMode
                  ? "bg-[#252A34] border-[#3a3f4b] text-text_darkMode"
                  : "bg-[#f8f9ff] border-gray-300"
                  }`}
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-primary-color text-white rounded-md text-sm hover:opacity-90 transition"
              >
                Tìm
              </button>
            </div>
          </form>

          {/* Genres Grid */}
          <div className="mb-5">
            <p className="font-semibold mb-3">Thể loại</p>
            <div className="grid phone:grid-cols-2 tablet:grid-cols-3 lg:grid-cols-4 gap-2">
              {genres.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleGenreClick(item.slug)}
                  className={`flex items-center p-2.5 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200
                    ${selectedGenre === item.slug
                      ? "bg-primary-color text-white shadow-md"
                      : darkMode
                        ? "hover:bg-[#252A34] border border-[#3a3f4b]"
                        : "hover:bg-[#EEF3FD] border border-gray-200 hover:text-primary-color"
                    }`}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>

          {/* Filter Options */}
          <div className="grid tablet:grid-cols-2 gap-4 mb-5">
            <div className="flex justify-between items-center">
              <label className="font-semibold">Số chương</label>
              <select
                className={selectClass}
                value={minChapters}
                onChange={(e) => setMinChapters(Number(e.target.value))}
              >
                <option value={0}>Tất cả</option>
                <option value={10}>≥ 10 chương</option>
                <option value={50}>≥ 50 chương</option>
                <option value={100}>≥ 100 chương</option>
                <option value={500}>≥ 500 chương</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <label className="font-semibold">Trạng thái</label>
              <select
                className={selectClass}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="on-going">Đang cập nhật</option>
                <option value="completed">Hoàn thành</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <label className="font-semibold">Sắp xếp</label>
              <select
                className={selectClass}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Mặc định</option>
                <option value="new">Mới cập nhật</option>
                <option value="old">Cũ nhất</option>
                <option value="az">Từ A-Z</option>
                <option value="za">Từ Z-A</option>
              </select>
            </div>
          </div>

          {/* Apply Filter Button */}
          <button
            onClick={handleApplyFilters}
            className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:opacity-90 transition shadow-md"
          >
            <FontAwesomeIcon icon={faFilter} className="mr-2" />
            Lọc truyện
          </button>

          {/* Results */}
          <div className="mt-8">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-color border-t-transparent"></div>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-20 opacity-60">
                <p className="text-lg">Không tìm thấy truyện phù hợp</p>
              </div>
            ) : (
              <div className="grid phone:grid-cols-2 phone:gap-2 tablet:grid-cols-3 lg:grid-cols-4 desktop:grid-cols-5 lg:gap-4">
                {results.map((item) => {
                  let trimmedTimeAgo = "";
                  try {
                    trimmedTimeAgo = formatDistanceToNow(
                      new Date(item.updatedAt),
                      { addSuffix: true, locale: vi }
                    ).replace(/^khoảng\s/, "");
                  } catch (e) {
                    trimmedTimeAgo = "";
                  }
                  return (
                    <CardStories
                      key={item._id}
                      slug={item.slug}
                      title={item.name}
                      img={`https://img.otruyenapi.com/uploads/comics/${item.thumb_url}`}
                      time={trimmedTimeAgo}
                      chapter={item.chaptersLatest?.[0]?.chapter_name}
                      nomarl
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8 pt-5 border-t">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg transition ${currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-primary-color text-white hover:opacity-90"
                  }`}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>

              {Array.from(
                { length: Math.min(5, totalPages) },
                (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${currentPage === pageNum
                        ? "bg-primary-color text-white shadow-md"
                        : darkMode
                          ? "bg-[#252A34] hover:bg-[#3a3f4b]"
                          : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg transition ${currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-primary-color text-white hover:opacity-90"
                  }`}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default FilterStories;
