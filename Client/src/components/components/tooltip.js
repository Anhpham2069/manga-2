import React, { useEffect, useState } from "react";
import { Tooltip } from "antd";
import "../HomeComponent/style.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../layout/DarkModeSlice";

const TooltipComponent = ({ sx }) => {
  const [genres, setGenres] = useState([]);
  const isDarkMode = useSelector(selectDarkMode);

  // Pastel colors for genre buttons
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
        const res = await axios.get(`https://otruyenapi.com/v1/api/the-loai`);
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
        console.error("Lỗi lấy thể loại:", error);
      }
    };
    fetchDataGenres();
  }, []);

  if (sx) {
    // ===== MENU THỂ LOẠI (dùng trong Navbar) =====
    return (
      <div
        className={`max-w-[700px] w-full max-h-[70vh] overflow-y-auto p-4 rounded-xl ${isDarkMode ? "bg-[#1e293b]" : "bg-white"
          }`}
      >
        <h3
          className={`text-sm font-bold uppercase tracking-wider mb-3 px-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
        >
          Thể loại truyện
        </h3>
        <div className="flex flex-wrap gap-2">
          {genres.map((item) => {
            const colorClass = isDarkMode
              ? item.darkColor
              : item.lightColor;
            return (
              <Link to={`/category/${item.slug}`} key={item._id}>
                <div
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 shadow-sm ${colorClass}`}
                >
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // ===== MENU RATING (không dùng nữa nhưng giữ lại) =====
  const rating = ["Top ngày", "Top tuần", "Top tháng", "Được yêu thích"];
  return (
    <div
      className={`w-48 p-2 rounded-xl ${isDarkMode ? "bg-[#1e293b]" : "bg-white"
        }`}
    >
      {rating.map((item, index) => (
        <div
          key={index}
          className={`px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ${isDarkMode
            ? "text-gray-300 hover:bg-blue-600/20 hover:text-blue-400"
            : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default TooltipComponent;