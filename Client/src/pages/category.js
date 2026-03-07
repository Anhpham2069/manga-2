import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../components/layout/DarkModeSlice";
import CardStories from "../components/components/cardStories";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faTableCells } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import axios from "axios";
import { Skeleton } from "antd";
import { useParams } from "react-router-dom";
import Pagination from "../components/components/pagination";

const Category = () => {
  const { slug: initialSlug } = useParams();
  const darkMode = useSelector(selectDarkMode);

  const [loading, setLoading] = useState(false);
  const [isCategory, setIsCategory] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialSlug);
  const [viewsMap, setViewsMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [seo, setSeo] = useState(null);

  // 👇 chế độ hiển thị
  const [viewMode, setViewMode] = useState("grid");

  // ====== LOAD VIEW MODE SAVED ======
  useEffect(() => {
    const saved = localStorage.getItem("viewMode");
    if (saved) setViewMode(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  // ====== LẤY THỂ LOẠI ======
  useEffect(() => {
    const fetchDataGenres = async () => {
      try {
        const res = await axios.get("https://otruyenapi.com/v1/api/the-loai");
        setGenres(res.data.data.items);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDataGenres();

    const fetchSeo = async () => {
      try {
        const apiURL = process.env.REACT_APP_API_URL || "http://localhost:8000";
        const res = await axios.get(`${apiURL}/api/seo`);
        setSeo(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSeo();
  }, []);

  // ====== LẤY TRUYỆN ======
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://otruyenapi.com/v1/api/the-loai/${selectedCategory}?page=${currentPage}`
        );
        setIsCategory(res.data.data);

        const pagination = res.data.data?.params?.pagination;
        if (pagination) {
          setTotalPages(Math.ceil(pagination.totalItems / (pagination.totalItemsPerPage || 24)));
        } else {
          setTotalPages(1);
        }

        // Fetch views batch
        const slugs = res.data.data?.items?.map((item) => item.slug) || [];
        if (slugs.length > 0) {
          try {
            const apiURL = process.env.REACT_APP_API_URL;
            const viewsRes = await axios.post(`${apiURL}/api/views/batch`, { slugs });
            setViewsMap(viewsRes.data || {});
          } catch (e) { console.log(e); }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (selectedCategory) fetchData();
  }, [selectedCategory, currentPage]);

  const handleCategoryChange = (e, slug) => {
    e.preventDefault();
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getSeoContent = () => {
    let title = isCategory?.titlePage ? `${isCategory.titlePage} - DocTruyen5s` : 'Thể loại - DocTruyen5s';
    let desc = `Danh sách truyện thể loại ${isCategory?.titlePage || ''} tại DocTruyen5s`;

    if (seo && seo.categoryTitle) {
      title = seo.categoryTitle.replace(/\[category\]/gi, isCategory?.titlePage || "Đang cập nhật");
    }
    if (seo && seo.categoryDesc) {
      desc = seo.categoryDesc.replace(/\[category\]/gi, isCategory?.titlePage || "Đang cập nhật");
    }

    return { title, desc };
  };

  const { title: seoTitle, desc: seoDesc } = getSeoContent();

  return (
    <div className={`${darkMode ? "bg-bg_dark text-text_darkMode" : "bg-bg_light"}`}>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:type" content="website" />
      </Helmet>
      <NavBar />

      <div className="w-[95%] mt-6 m-auto flex">
        <div className="w-[95%] mt-6 m-auto flex gap-6">

          {/* ================= MAIN CONTENT ================= */}
          <div className="flex-1">
            <div className={`${darkMode ? "bg-bg_dark_light text-text_darkMode" : "bg-white"} p-5 rounded-xl`}>

              {/* HEADER */}
              <div className="py-2 h-12 flex items-center justify-between text-xl font-semibold border-b">
                <p>
                  <span className="font-bold">Thể loại:</span> {isCategory?.titlePage}
                </p>

                {/* Toggle view */}
                <div className="flex gap-4 text-slate-500">
                  <FontAwesomeIcon
                    icon={faList}
                    size="xl"
                    onClick={() => setViewMode("list")}
                    className={`cursor-pointer hover:text-primary-color ${viewMode === "list" && "text-primary-color"
                      }`}
                  />
                  <FontAwesomeIcon
                    icon={faTableCells}
                    size="xl"
                    onClick={() => setViewMode("grid")}
                    className={`cursor-pointer hover:text-primary-color ${viewMode === "grid" && "text-primary-color"
                      }`}
                  />
                </div>
              </div>

              {/* MOBILE SELECT GENRES */}
              <select
                className="phone:block tablet:hidden w-full bg-[#E6F4FF] rounded-xl p-2 my-5 text-primary-color"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {genres?.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>

              {/* LIST / GRID STORIES */}
              <div
                className={`grid gap-4 mt-6 ${viewMode === "grid"
                  ? "phone:grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-6 desktop:grid-cols-4"
                  : "grid-cols-1"
                  }`}
              >
                {loading && <Skeleton active />}

                {isCategory?.items?.map((item) => {
                  const trimmedTimeAgo = formatDistanceToNow(
                    new Date(item.updatedAt),
                    { addSuffix: true, locale: vi }
                  ).replace(/^khoảng\s/, "");

                  return (
                    <CardStories
                      key={item._id}
                      slug={item.slug}
                      title={item.name}
                      img={`https://img.otruyenapi.com/uploads/comics/${item.thumb_url}`}
                      time={trimmedTimeAgo}
                      chapter={item.chaptersLatest?.[0]?.chapter_name}
                      views={viewsMap[item.slug] || 0}
                      viewMode={viewMode}
                    />
                  );
                })}
              </div>

              {/* PAGINATION */}
              <div className="mt-8 pb-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                />
              </div>
            </div>
          </div>

          {/* ================= SIDEBAR GENRES ================= */}
          <div className="w-[260px] phone:hidden tablet:block">
            <div className={`${darkMode ? "bg-bg_dark_light" : "bg-white"} p-5 rounded-xl`}>
              <h3 className="text-xl font-semibold border-b pb-2 mb-4 text-primary-color">
                Thể loại
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {genres?.map((item) => (
                  <div
                    key={item.slug}
                    onClick={(e) => handleCategoryChange(e, item.slug)}
                    className={`cursor-pointer text-sm p-2 rounded-lg transition ${selectedCategory === item.slug
                      ? "bg-primary-color text-white"
                      : "hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Category;
