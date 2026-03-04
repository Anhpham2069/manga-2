import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../components/layout/DarkModeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrophy,
    faEye,
    faFire,
    faMedal,
    faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { getNumberSaveStory } from "../services/apiStoriesRequest";

const apiURL = process.env.REACT_APP_API_URL;

const Ranking = () => {
    const isDarkModeEnable = useSelector(selectDarkMode);
    const [ranking, setRanking] = useState([]);
    const [period, setPeriod] = useState("week");
    const [loading, setLoading] = useState(false);
    const [saveStory, setSaveStory] = useState({});
    const [viewsMap, setViewsMap] = useState({});

    useEffect(() => {
        const fetchRanking = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `${apiURL}/api/history/ranking?period=${period}`
                );
                let rankingData = res.data || [];

                // Fetch real views from StoryView
                const slugs = rankingData.map((item) => item._id);
                if (slugs.length > 0) {
                    try {
                        const viewsRes = await axios.post(
                            `${apiURL}/api/views/batch`, { slugs }
                        );
                        setViewsMap(viewsRes.data || {});
                    } catch (e) { console.log(e); }
                }

                // Fix missing story names — fetch from OTruyen API
                const missingNameItems = rankingData.filter(
                    (item) => !item.storyInfo?.item?.name
                );
                if (missingNameItems.length > 0) {
                    const fetchPromises = missingNameItems.map(async (item) => {
                        try {
                            const detailRes = await axios.get(
                                `https://otruyenapi.com/v1/api/truyen-tranh/${item._id}`
                            );
                            return { slug: item._id, data: detailRes.data?.data };
                        } catch (e) {
                            return { slug: item._id, data: null };
                        }
                    });
                    const results = await Promise.all(fetchPromises);
                    const nameMap = {};
                    results.forEach((r) => {
                        if (r.data) nameMap[r.slug] = r.data;
                    });

                    rankingData = rankingData.map((item) => {
                        if (!item.storyInfo?.item?.name && nameMap[item._id]) {
                            return {
                                ...item,
                                storyInfo: nameMap[item._id],
                            };
                        }
                        return item;
                    });
                }

                setRanking(rankingData);
            } catch (error) {
                console.error("Error fetching ranking:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRanking();
    }, [period]);

    // Fetch save/favorite counts
    useEffect(() => {
        const fetchSaves = async () => {
            try {
                const res = await getNumberSaveStory();
                if (res) setSaveStory(res);
            } catch (error) {
                console.log(error);
            }
        };
        fetchSaves();
    }, []);

    const periods = [
        { key: "day", label: "Ngày" },
        { key: "week", label: "Tuần" },
        { key: "month", label: "Tháng" },
    ];

    const getMedalColor = (index) => {
        if (index === 0) return "text-yellow-400";
        if (index === 1) return "text-gray-400";
        if (index === 2) return "text-amber-600";
        return "text-transparent";
    };

    return (
        <div className={`${isDarkModeEnable ? "bg-bg_dark" : "bg-bg_light"} min-h-screen`}>
            <Helmet>
                <title>Bảng xếp hạng - DocTruyen5s</title>
                <meta name="description" content="Bảng xếp hạng truyện tranh được đọc nhiều nhất tại DocTruyen5s. Xem top truyện hot theo ngày, tuần, tháng." />
                <meta property="og:title" content="Bảng xếp hạng - DocTruyen5s" />
                <meta property="og:description" content="Bảng xếp hạng truyện tranh được đọc nhiều nhất tại DocTruyen5s." />
                <meta property="og:type" content="website" />
            </Helmet>
            <NavBar />
            <div className="max-w-full tablet:max-w-[90%] lg:max-w-[70%] mx-auto py-6 lg:py-8 px-3 sm:px-4">
                {/* Header */}
                <div
                    className={`${isDarkModeEnable
                        ? "bg-bg_dark_light text-text_darkMode"
                        : "bg-white"
                        } rounded-xl shadow-lg p-6 mb-6`}
                >
                    <h1 className="text-2xl font-bold text-primary-color flex items-center gap-3">
                        <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />
                        Bảng Xếp Hạng
                    </h1>
                    <p className="mt-2 opacity-60">
                        Truyện được đọc nhiều nhất
                    </p>

                    {/* Period Tabs */}
                    <div className="flex gap-2 mt-5">
                        {periods.map((p) => (
                            <button
                                key={p.key}
                                onClick={() => setPeriod(p.key)}
                                className={`px-6 py-2 rounded-full font-medium transition-all duration-200
                  ${period === p.key
                                        ? "bg-primary-color text-white shadow-md"
                                        : isDarkModeEnable
                                            ? "bg-[#252A34] text-text_darkMode hover:bg-[#3a3f4b]"
                                            : "bg-[#EEF3FD] text-primary-color hover:bg-primary-color hover:text-white"
                                    }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Ranking List */}
                <div
                    className={`${isDarkModeEnable
                        ? "bg-bg_dark_light text-text_darkMode"
                        : "bg-white"
                        } rounded-xl shadow-lg overflow-hidden`}
                >
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-color border-t-transparent"></div>
                        </div>
                    ) : ranking.length === 0 ? (
                        <div className="text-center py-20 opacity-60">
                            <FontAwesomeIcon icon={faFire} size="3x" className="mb-4" />
                            <p className="text-lg">Chưa có dữ liệu xếp hạng</p>
                        </div>
                    ) : (
                        <div>
                            {ranking.map((item, index) => {
                                const favCount = saveStory?.[item._id] || 0;
                                return (
                                    <Link
                                        key={item._id}
                                        to={`/detail/${item._id}`}
                                        className="block"
                                    >
                                        <div
                                            className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 transition-all duration-200 border-b
                      ${isDarkModeEnable
                                                    ? "border-[#3a3f4b] hover:bg-[#252A34]"
                                                    : "border-[#f0f0f0] hover:bg-[#f8f9ff]"
                                                }
                      ${index < 3 ? "sm:py-5" : ""}
                    `}
                                        >
                                            {/* Rank Number */}
                                            <div className="w-8 sm:w-12 text-center flex-shrink-0">
                                                {index < 3 ? (
                                                    <FontAwesomeIcon
                                                        icon={faMedal}
                                                        className={`text-xl sm:text-2xl ${getMedalColor(index)}`}
                                                    />
                                                ) : (
                                                    <span
                                                        className={`text-lg sm:text-xl font-bold ${isDarkModeEnable ? "text-gray-500" : "text-gray-400"
                                                            }`}
                                                    >
                                                        {index + 1}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Image */}
                                            <img
                                                className={`${index < 3 ? "w-14 h-20 sm:w-20 sm:h-28" : "w-12 h-16 sm:w-16 sm:h-22"
                                                    } object-cover rounded-lg shadow-md flex-shrink-0`}
                                                src={
                                                    item.storyInfo?.seoOnPage?.seoSchema?.image ||
                                                    `https://img.otruyenapi.com/uploads/comics/${item._id}-thumb.jpg`
                                                }
                                                alt={item.storyInfo?.item?.name || item._id}
                                            />

                                            {/* Info + Stats */}
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={`font-semibold truncate ${index < 3 ? "text-base sm:text-lg" : "text-sm sm:text-base"
                                                        }`}
                                                >
                                                    {item.storyInfo?.item?.name || item._id}
                                                </p>

                                                {/* Views & Saves — below title on mobile */}
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <div className="flex items-center gap-1">
                                                        <FontAwesomeIcon
                                                            icon={faEye}
                                                            className="text-primary-color text-xs sm:text-sm"
                                                        />
                                                        <span
                                                            className={`font-bold text-sm sm:text-base ${index < 3 ? "text-primary-color" : ""
                                                                }`}
                                                        >
                                                            {(viewsMap[item._id] || 0).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <FontAwesomeIcon
                                                            icon={faBookmark}
                                                            className="text-pink-400 text-xs sm:text-sm"
                                                        />
                                                        <span className={`font-medium text-sm sm:text-base`}>
                                                            {favCount}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Categories */}
                                                <div className="flex flex-wrap gap-1 mt-1.5">
                                                    {item.storyInfo?.item?.category
                                                        ?.slice(0, 3)
                                                        .map((cate) => (
                                                            <span
                                                                key={cate.id}
                                                                className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded ${isDarkModeEnable
                                                                    ? "bg-[#252A34] text-text_darkMode"
                                                                    : "bg-[#EEF3FD] text-primary-color"
                                                                    }`}
                                                            >
                                                                {cate.name}
                                                            </span>
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Ranking;
