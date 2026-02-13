import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faEye } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../layout/DarkModeSlice";

const CardStories = ({
  slug,
  title,
  img,
  time,
  views = 1000,
  saves = 100,
  nomarl,
  hot,
  chapter,
  viewMode = "grid", // 👈 THÊM
}) => {
  const isDarkModeEnable = useSelector(selectDarkMode);

  // ================= LIST MODE =================
  if (viewMode === "list") {
    return (
      <div className="w-full border-b pb-4 hover:bg-slate-50 dark:hover:bg-slate-800 p-3 rounded-xl transition">
        <Link to={`/detail/${slug}`} className="flex gap-4">
          <div className="w-28 h-36 overflow-hidden rounded-lg flex-shrink-0">
            <img
              src={img}
              alt={title}
              className="w-full h-full object-cover hover:scale-110 transition"
            />
          </div>

          <div className="flex flex-col justify-between flex-1">
            <div>
              <h3
                className={`font-semibold text-lg line-clamp-2 ${
                  isDarkModeEnable ? "text-[#CCCCCC]" : "text-black"
                }`}
              >
                {title}
              </h3>

              <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faEye} /> {views}
                </span>
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faBookmark} /> {saves}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-400">{time}</span>
              <span className="bg-[#FF4500] text-white text-xs px-3 py-1 rounded-full">
                Chương {chapter}
              </span>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // ================= GRID MODE (GIỐNG BẠN) =================
  return (
    <figure className="w-full h-80 cursor-pointer my-5">
      <div className="relative h-[75%] w-full overflow-hidden rounded-sm">
        <Link to={`/detail/${slug}`}>
          <img
            src={img}
            alt={title}
            className="w-full h-full border-2 border-gray-200 object-cover transition-all duration-500 hover:scale-125"
          />
        </Link>

        {nomarl && (
          <>
            <button className="absolute top-1 left-1 bg-primary-color text-white text-xs px-2 py-1 rounded-md">
              {time}
            </button>
            <button className="absolute top-1 right-1 bg-[#FF4500] text-white text-xs px-2 py-1 rounded-md">
              Chương {chapter}
            </button>
          </>
        )}

        {hot && (
          <button className="absolute top-1 right-1 bg-[#FF4500] text-white text-xs px-2 py-1 rounded-md uppercase">
            Hot
          </button>
        )}
      </div>

      <div className="mt-2">
        <Link to={`/detail/${slug}`}>
          <h3
            className={`line-clamp-2 ${
              isDarkModeEnable ? "text-[#CCCCCC]" : "text-black"
            } font-medium`}
          >
            {title}
          </h3>
        </Link>
      </div>
    </figure>
  );
};

export default CardStories;
