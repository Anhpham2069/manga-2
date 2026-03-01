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

  useEffect(() => {
    const fetchDataGenres = async () => {
      try {
        const res = await axios.get(`https://otruyenapi.com/v1/api/the-loai`);
        if (res.data?.data?.items) {
          setGenres(res.data.data.items);
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
        className={`w-[700px] max-h-[70vh] overflow-y-auto p-4 rounded-xl ${isDarkMode ? "bg-[#1e293b]" : "bg-white"
          }`}
      >
        <h3
          className={`text-sm font-bold uppercase tracking-wider mb-3 px-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
        >
          Thể loại truyện
        </h3>
        <div className="grid grid-cols-4 gap-1.5">
          {genres.map((item) => (
            <Link to={`/category/${item.slug}`} key={item._id}>
              <div
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isDarkMode
                    ? "text-gray-300 hover:bg-blue-600/20 hover:text-blue-400"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
              >
                {item.name}
              </div>
            </Link>
          ))}
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