import React, { useState, useEffect } from "react";
import axios from "axios";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const StoryFilterMenu = ({ activeFilter, setActiveFilter, setSlug }) => {
  const navigate = useNavigate();

  const [showMore, setShowMore] = useState(false);
  const [genres, setGenres] = useState([]);

  // Danh sách màu pastel đẹp
  const colors = [
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

  useEffect(() => {
    const fetchDataGenres = async () => {
      try {
        const res = await axios.get(
          `https://otruyenapi.com/v1/api/the-loai`
        );
        if (res.data?.data?.items) {
          // Gán màu random cho mỗi genre
          const genresWithColor = res.data.data.items.map((genre) => ({
            ...genre,
            color: colors[Math.floor(Math.random() * colors.length)],
          }));

          setGenres(genresWithColor);
        }
      } catch (error) {
        console.log("Lỗi lấy thể loại:", error);
      }
    };

    fetchDataGenres();
  }, []);

  const visibleGenres = showMore ? genres : genres.slice(0, 20);

  return (
    <div className="w-full bg-white p-5">
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
              ${
                activeFilter === genre.slug
                  ? "bg-primary-color text-white scale-105 shadow-md"
                  : genre.color
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
            className="px-4 py-1 rounded-md text-sm font-medium bg-gray-300 hover:bg-gray-400 text-gray-800 flex items-center gap-1 transition-all"
          >
            {showMore ? "Thu gọn" : "+ More"}
            <DownOutlined
              className={`transition-transform ${
                showMore ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryFilterMenu;
