import React, { useState, useEffect } from "react";
import axios from "axios";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../layout/DarkModeSlice";

const StoryFilterMenu = ({ activeFilter, setActiveFilter, setSlug }) => {
  const navigate = useNavigate();
  const isDarkMode = useSelector(selectDarkMode);

  const [showMore, setShowMore] = useState(false);
  const [genres, setGenres] = useState([]);

  // Danh sách màu pastel — light mode
  const lightColors = [
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
  ];

  // Danh sách màu — dark mode
  const darkColors = [
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
  ];

  useEffect(() => {
    const fetchDataGenres = async () => {
      try {
        const res = await axios.get(
          `https://otruyenapi.com/v1/api/the-loai`
        );
        if (res.data?.data?.items) {
          const genresWithColor = res.data.data.items.map((genre) => {
            const idx = Math.floor(Math.random() * lightColors.length);
            return {
              ...genre,
              lightColor: lightColors[idx],
              darkColor: darkColors[idx],
            };
          });
          setGenres(genresWithColor);
        }
      } catch (error) {
        console.log("Lỗi lấy thể loại:", error);
      }
    };

    fetchDataGenres();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleGenres = showMore ? genres : genres.slice(0, 20);

  return (
    <div
      className={`w-full p-5 transition-colors duration-300 ${isDarkMode ? "bg-[#1e293b]" : "bg-white"
        }`}
    >
      <div className="flex flex-wrap gap-2">
        {visibleGenres.map((genre) => (
          <button
            key={genre._id}
            onClick={() => {
              setActiveFilter(genre.slug);
              setSlug(genre.slug);
              navigate(`/category/${genre.slug}`);
            }}
            className={`px-4 py-1 rounded-md text-sm font-medium transition-all duration-200 shadow-sm
              ${activeFilter === genre.slug
                ? "bg-primary-color text-white scale-105 shadow-md"
                : isDarkMode
                  ? genre.darkColor
                  : genre.lightColor
              }
            `}
          >
            {genre.name}
          </button>
        ))}

        {/* Nút More */}
        {genres.length > 20 && (
          <button
            onClick={() => setShowMore(!showMore)}
            className={`px-4 py-1 rounded-md text-sm font-medium flex items-center gap-1 transition-all ${isDarkMode
              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
              : "bg-gray-300 hover:bg-gray-400 text-gray-800"
              }`}
          >
            {showMore ? "Thu gọn" : "+ More"}
            <DownOutlined
              className={`transition-transform ${showMore ? "rotate-180" : ""
                }`}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryFilterMenu;
