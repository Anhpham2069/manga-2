import React, { useEffect, useState } from "react";
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
                setRanking(res.data);
                // Fetch real views from StoryView
                const slugs = (res.data || []).map((item) => item._id);
                if (slugs.length > 0) {
                    try {
                        const viewsRes = await axios.post(
                            `${apiURL}/api/views/batch`, { slugs }
                        );
                        setViewsMap(viewsRes.data || {});
                    } catch (e) { console.log(e); }
                }
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
            <NavBar />
            <div className="max-w-[70%] mx-auto py-8 px-4">
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
                                            className={`flex items-center gap-4 p-4 transition-all duration-200 border-b
                      ${isDarkModeEnable
                                                    ? "border-[#3a3f4b] hover:bg-[#252A34]"
                                                    : "border-[#f0f0f0] hover:bg-[#f8f9ff]"
                                                }
                      ${index < 3 ? "py-5" : ""}
                    `}
                                        >
                                            {/* Rank Number */}
                                            <div className="w-12 text-center flex-shrink-0">
                                                {index < 3 ? (
                                                    <FontAwesomeIcon
                                                        icon={faMedal}
                                                        size="2x"
                                                        className={getMedalColor(index)}
                                                    />
                                                ) : (
                                                    <span
                                                        className={`text-xl font-bold ${isDarkModeEnable ? "text-gray-500" : "text-gray-400"
                                                            }`}
                                                    >
                                                        {index + 1}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Image */}
                                            <img
                                                className={`${index < 3 ? "w-20 h-28" : "w-16 h-22"
                                                    } object-cover rounded-lg shadow-md flex-shrink-0`}
                                                src={
                                                    item.storyInfo?.seoOnPage?.seoSchema?.image ||
                                                    `https://img.otruyenapi.com/uploads/comics/${item._id}-thumb.jpg`
                                                }
                                                alt={item.storyInfo?.item?.name || item._id}
                                            />

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={`font-semibold truncate ${index < 3 ? "text-lg" : "text-base"
                                                        }`}
                                                >
                                                    {item.storyInfo?.item?.name || item._id}
                                                </p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {item.storyInfo?.item?.category
                                                        ?.slice(0, 3)
                                                        .map((cate) => (
                                                            <span
                                                                key={cate.id}
                                                                className={`text-xs px-2 py-0.5 rounded ${isDarkModeEnable
                                                                    ? "bg-[#252A34] text-text_darkMode"
                                                                    : "bg-[#EEF3FD] text-primary-color"
                                                                    }`}
                                                            >
                                                                {cate.name}
                                                            </span>
                                                        ))}
                                                </div>
                                            </div>

                                            {/* Views & Saves */}
                                            <div className="flex items-center gap-4 flex-shrink-0">
                                                <div className="flex items-center gap-1.5">
                                                    <FontAwesomeIcon
                                                        icon={faEye}
                                                        className="text-primary-color"
                                                    />
                                                    <span
                                                        className={`font-bold ${index < 3 ? "text-lg text-primary-color" : ""
                                                            }`}
                                                    >
                                                        {(viewsMap[item._id] || 0).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <FontAwesomeIcon
                                                        icon={faBookmark}
                                                        className="text-pink-400"
                                                    />
                                                    <span className={`font-medium ${index < 3 ? "text-lg" : ""}`}>
                                                        {favCount}
                                                    </span>
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
