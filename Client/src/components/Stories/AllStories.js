import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../layout/DarkModeSlice";
import CardStories from "../components/cardStories";
import NavBar from "../layout/Navbar";
import Footer from "../layout/footer";
import axios from "axios";
import { Skeleton } from "antd";
import Pagination from "../components/pagination";

const AllStories = () => {
  const darkMode = useSelector(selectDarkMode);

  const [storiesData, setStoriesData] = useState([]);
  const [slug, setSlug] = useState("truyen-moi");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [viewsMap, setViewsMap] = useState({});
  const [savesMap, setSavesMap] = useState({});



  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, currentPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://otruyenapi.com/v1/api/danh-sach/${slug}`,
        {
          params: {
            page: currentPage,
          },
        }
      );

      if (res.data?.data) {
        setStoriesData(res.data.data);

        const totalItems =
          res.data.data.params.pagination.totalItems;

        const totalItemsPerPage =
          res.data.data.params.pagination.totalItemsPerPage;

        setTotalPages(Math.ceil(totalItems / totalItemsPerPage));

        // Fetch views batch
        const slugs = res.data.data.items?.map((item) => item.slug) || [];
        if (slugs.length > 0) {
          try {
            const apiURL = process.env.REACT_APP_API_URL;
            const viewsRes = await axios.post(`${apiURL}/api/views/batch`, { slugs });
            setViewsMap(viewsRes.data || {});
          } catch (e) { console.log(e); }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionClick = (sectionSlug) => {
    setSlug(sectionSlug);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPageRange = () => {
    const pageRange = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    for (let i = startPage; i <= endPage; i++) {
      pageRange.push(i);
    }
    return pageRange;
  };

  return (
    <div className={`${darkMode ? "bg-bg_dark text-text_darkMode" : "bg-bg_light"}`}>
      <Helmet>
        <title>Tất cả truyện - DocTruyen5s</title>
        <meta name="description" content="Danh sách tất cả truyện tranh mới nhất, đang phát hành, hoàn thành tại DocTruyen5s. Cập nhật liên tục." />
        <meta property="og:title" content="Tất cả truyện - DocTruyen5s" />
        <meta property="og:description" content="Danh sách tất cả truyện tranh mới nhất, đang phát hành, hoàn thành tại DocTruyen5s." />
        <meta property="og:type" content="website" />
      </Helmet>
      <NavBar />

      <div className="grid laptop:grid-cols-5 gap-6 w-[95%] mt-6 m-auto">

        {/* ===== SIDEBAR ===== */}
        <div
          className={`col-span-1 h-fit rounded-xl ${darkMode ? "bg-bg_dark_light" : "bg-white shadow"
            }`}
        >
          {[
            { label: "Truyện mới", value: "truyen-moi" },
            { label: "Sắp ra mắt", value: "sap-ra-mat" },
            { label: "Đang phát hành", value: "dang-phat-hanh" },
            { label: "Hoàn thành", value: "hoan-thanh" },
          ].map((item) => (
            <div
              key={item.value}
              onClick={() => handleSectionClick(item.value)}
              className={`p-5 cursor-pointer border-r-4 transition ${slug === item.value
                ? "bg-blue-100 text-blue-600 border-blue-500"
                : darkMode
                  ? "hover:bg-gray-700 border-transparent"
                  : "hover:bg-gray-100 border-transparent"
                }`}
            >
              {item.label}
            </div>
          ))}
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <div
          className={`laptop:col-span-4 p-5 rounded-xl ${darkMode ? "bg-bg_dark_light" : "bg-white shadow"
            }`}
        >
          <div className="pb-3 text-lg font-semibold border-b">
            All Manga
          </div>

          {/* GRID */}
          <div
            className="
              mt-6
              grid
              phone:grid-cols-2 phone:gap-3
              tablet:grid-cols-3
              laptop:grid-cols-4
              desktop:grid-cols-5
              gap-5
            "
          >
            {loading &&
              Array.from({ length: 12 }).map((_, index) => (
                <Skeleton key={index} active />
              ))}

            {!loading &&
              storiesData.items?.map((item) => {
                const timeAgo = formatDistanceToNow(
                  new Date(item.updatedAt),
                  {
                    addSuffix: true,
                    locale: vi,
                  }
                );

                const trimmedTimeAgo = timeAgo.replace(
                  /^khoảng\s/,
                  ""
                );

                return (
                  <CardStories
                    key={item._id}
                    id={item._id}
                    title={item.name}
                    img={`https://img.otruyenapi.com/uploads/comics/${item.thumb_url}`}
                    slug={item.slug}
                    time={trimmedTimeAgo}
                    views={viewsMap[item.slug] || 0}
                    chapter={
                      item.chaptersLatest?.[0]?.chapter_name || ""
                    }
                    nomarl
                  />
                );
              })}
          </div>

          {/* PAGINATION */}
          <div className="p-4 flex justify-center mt-10 border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              getPageRange={getPageRange}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AllStories;
