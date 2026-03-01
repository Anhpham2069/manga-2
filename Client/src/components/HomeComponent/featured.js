import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Helmet } from "react-helmet";
import { vi } from "date-fns/locale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStarOfLife,
  faFire,
  faBookmark,
  faEye,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";
import CardStories from "../components/cardStories";
import { useDispatch, useSelector } from "react-redux";
import { selectDarkMode } from "../layout/DarkModeSlice";
import { getNumberSaveStory, getStoriesByList, getRanking } from "../../services/apiStoriesRequest";
import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

const Featured = ({ dark }) => {
  const dispatch = useDispatch();
  const isDarkModeEnable = useSelector(selectDarkMode);

  const [storiesData, setStoriesData] = useState([]);
  const [storiesFT, setStoriesFT] = useState([]);
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState("truyen-moi");
  const [selectedButton, setSelectedButton] = useState("tuannay");
  const [rankingData, setRankingData] = useState([]);
  const [saveStory, setSaveStory] = useState();
  const [rankingViewsMap, setRankingViewsMap] = useState({});
  const [gridViewsMap, setGridViewsMap] = useState({});

  // Fetch ranking + StoryView batch
  useEffect(() => {
    const periodMap = { homnay: "day", tuannay: "week", thangnay: "month" };
    const fetchRanking = async () => {
      try {
        const res = await getRanking(periodMap[selectedButton] || "week");
        setRankingData(res || []);
        // Fetch real views from StoryView
        const slugs = (res || []).map((item) => item._id);
        if (slugs.length > 0) {
          try {
            const viewsRes = await axios.post(`${apiURL}/api/views/batch`, { slugs });
            setRankingViewsMap(viewsRes.data || {});
          } catch (e) { console.log(e); }
        }
      } catch (error) { console.log(error); }
    };
    fetchRanking();
  }, [selectedButton]);

  // Fetch save counts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getNumberSaveStory(dispatch);
        if (res) setSaveStory(res);
      } catch (error) { console.log(error); }
    };
    fetchData();
  }, []);

  // Fetch stories list + views
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getStoriesByList(slug);
        if (res.data) {
          setStoriesData(res.data);
          // Fetch views batch
          const slugs = res.data.items?.map((item) => item.slug) || [];
          if (slugs.length > 0) {
            try {
              const viewsRes = await axios.post(`${apiURL}/api/views/batch`, { slugs });
              setGridViewsMap(viewsRes.data || {});
            } catch (e) { console.log(e); }
          }
        }
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [slug]);

  // Fetch upcoming
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStoriesByList("sap-ra-mat");
        setStoriesFT(res.data);
      } catch (error) { console.log(error); }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-5 mt-4 px-3 tablet:px-6 lg:px-14">
      <Helmet>
        <title>Trang chủ - Đọc truyện 5s</title>
        <meta name="description" content="Khám phá những câu chuyện nổi bật mới nhất trên Đọc truyện 5s." />
      </Helmet>

      {/* ========== LEFT: Story Grid ========== */}
      <div className={`${isDarkModeEnable ? "bg-bg_dark_light text-text_darkMode" : "bg-white"} flex-1 shadow-md rounded-md overflow-hidden`}>
        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 py-2.5 border-b border-gray-200">
          <FontAwesomeIcon icon={faStarOfLife} color="#5383EE" className="mr-2 text-sm" />
          <TabButton active={slug === "truyen-moi"} onClick={() => setSlug("truyen-moi")} isDark={isDarkModeEnable}>
            MỚI CẬP NHẬT
          </TabButton>
          <TabButton active={slug === "hoan-thanh"} onClick={() => setSlug("hoan-thanh")} isDark={isDarkModeEnable}>
            HOT
          </TabButton>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 tablet:grid-cols-3 lg:grid-cols-4 desktop:grid-cols-4 gap-x-3 gap-y-0 p-3">
          {storiesData.items?.map((item) => {
            const timeAgo = formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true, locale: vi });
            const trimmedTimeAgo = timeAgo.replace(/^khoảng\s/, "");
            return (
              <CardStories
                key={item._id}
                id={item._id}
                title={item.name}
                img={`https://img.otruyenapi.com/uploads/comics/${item.thumb_url}`}
                slug={item.slug}
                time={trimmedTimeAgo}
                chapter={item.chaptersLatest?.[0]?.chapter_name}
                views={gridViewsMap[item.slug] || 0}
                saves={saveStory?.[item.slug] || 0}
                nomarl
              />
            );
          })}
        </div>

        <div className="w-full py-4 flex justify-center">
          <Link to="/all-stories">
            <button className="px-6 py-2 border border-gray-300 rounded hover:bg-primary-color hover:text-white transition text-sm">
              Xem Thêm
            </button>
          </Link>
        </div>
      </div>

      {/* ========== RIGHT: Sidebar ========== */}
      <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-4">

        {/* Xem nhiều */}
        <div className={`${isDarkModeEnable ? "bg-bg_dark_light text-text_darkMode" : "bg-white"} shadow-md rounded-md overflow-hidden`}>
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-200">
            <FontAwesomeIcon icon={faFire} className="text-orange-500" />
            <span className="uppercase text-primary-color font-bold text-sm">Xem nhiều</span>
          </div>

          {/* Period filter */}
          <div className={`flex mx-3 mt-3 rounded overflow-hidden border ${isDarkModeEnable ? "border-[#555] bg-[#333]" : "border-gray-200 bg-white"}`}>
            {[
              { key: "homnay", label: "Hôm nay" },
              { key: "tuannay", label: "Tuần này" },
              { key: "thangnay", label: "Tháng này" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => setSelectedButton(btn.key)}
                className={`flex-1 py-1.5 text-xs font-medium transition ${selectedButton === btn.key
                  ? "bg-primary-color text-white"
                  : isDarkModeEnable
                    ? "text-text_darkMode hover:bg-[#444]"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Ranking list */}
          <div className="py-2">
            {rankingData.length === 0 ? (
              <p className="text-center text-gray-400 py-4 text-sm">Chưa có dữ liệu</p>
            ) : (
              rankingData.slice(0, 8).map((item, index) => {
                const favCount = saveStory?.[item._id] || 0;
                return (
                  <Link to={`/detail/${item._id}`} key={index}
                    className={`flex gap-2.5 px-3 py-2 transition ${isDarkModeEnable ? "hover:bg-[#333]" : "hover:bg-gray-50"}`}
                  >
                    <img
                      src={`https://img.otruyenapi.com/uploads/${item.storyInfo?.seoOnPage?.og_image?.[0]}`}
                      alt=""
                      className="w-[50px] h-[65px] object-cover rounded shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[13px] leading-tight line-clamp-1">
                        {item.storyInfo?.item?.name}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Thể loại: </p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500">
                        <span className="flex items-center gap-0.5">
                          <FontAwesomeIcon icon={faEye} className="text-[9px]" />
                          {(rankingViewsMap[item._id] || 0).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <FontAwesomeIcon icon={faBookmark} className="text-[9px]" />
                          {favCount}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Truyện sắp ra mắt */}
        <div className={`${isDarkModeEnable ? "bg-bg_dark_light text-text_darkMode" : "bg-white"} shadow-md rounded-md overflow-hidden`}>
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-200">
            <FontAwesomeIcon icon={faCalendarDay} className="text-primary-color" />
            <span className="uppercase text-primary-color font-bold text-sm">Truyện sắp ra mắt</span>
          </div>
          {storiesFT.items?.slice(0, 6).map((item, index) => {
            const timeAgo = formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true, locale: vi });
            const trimmedTimeAgo = timeAgo.replace(/^khoảng\s/, "");
            return (
              <Link to={`/detail/${item.slug}`} key={item._id}
                className={`flex gap-2.5 px-3 py-2.5 border-b transition ${isDarkModeEnable ? "border-[#333] hover:bg-[#333]" : "border-gray-100 hover:bg-gray-50"}`}
              >
                <img
                  src={`https://img.otruyenapi.com${storiesFT.seoOnPage?.og_image?.[index]}`}
                  alt=""
                  className="w-[50px] h-[65px] object-cover rounded shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <p className="font-semibold text-[13px] line-clamp-1 leading-tight">{item.name}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">Ch. {item.chaptersLatest?.[0]?.chapter_name || ""}</span>
                    <span className="text-[11px] text-gray-400 italic">{trimmedTimeAgo}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, children, isDark }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded text-sm font-bold transition ${active
      ? "bg-primary-color text-white"
      : isDark
        ? "text-primary-color"
        : "text-primary-color hover:bg-gray-100"
      }`}
  >
    {children}
  </button>
);

export default Featured;
