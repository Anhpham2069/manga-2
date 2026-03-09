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
  views = 0,
  saves = 0,
  nomarl,
  hot,
  chapter,
  viewMode = "grid",
}) => {
  const isDarkModeEnable = useSelector(selectDarkMode);

  if (!chapter) {
    return null;
  }

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
              <h3 className={`font-semibold text-lg line-clamp-2 ${isDarkModeEnable ? "text-[#CCCCCC]" : "text-black"}`}>
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
              {chapter ? (
                <span className="bg-[#FF4500] text-white text-xs px-3 py-1 rounded-full">
                  Chương {chapter}
                </span>
              ) : (
                <span className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full">
                  Chưa có chap
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // ================= GRID MODE =================
  return (
    <figure className="w-full cursor-pointer mb-4">
      <div className="relative w-full overflow-hidden rounded-md" style={{ paddingBottom: "140%" }}>
        <Link to={`/detail/${slug}`}>
          <img
            src={img}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500 hover:scale-110"
          />
        </Link>

        {/* Time badge - top left */}
        {nomarl && time && (
          <span className="absolute top-1.5 left-1.5 bg-primary-color text-white text-[10px] px-1.5 py-0.5 rounded font-medium z-10">
            {time}
          </span>
        )}

        {/* Hot badge */}
        {hot && (
          <span className="absolute top-1.5 right-1.5 bg-[#FF4500] text-white text-[10px] px-1.5 py-0.5 rounded font-medium uppercase z-10">
            Hot
          </span>
        )}

        {/* No chapter badge - below time badge */}
        {!chapter && !hot && (
          <span className="absolute top-7 left-1.5 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium z-10">
            Chưa có chap
          </span>
        )}

        {/* View & Save counts - bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center px-2 py-1.5 z-10" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }}>
          <div className="flex items-center gap-3 text-white text-[11px] font-medium">
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faEye} className="text-[10px]" />
              {views?.toLocaleString?.() || 0}
            </span>
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faBookmark} className="text-[10px]" />
              {saves?.toLocaleString?.() || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mt-1.5 px-0.5">
        <Link to={`/detail/${slug}`}>
          <h3 className={`line-clamp-1 text-[13px] ${isDarkModeEnable ? "text-[#CCCCCC]" : "text-black"} font-medium leading-tight`}>
            {title}
          </h3>
        </Link>
        {chapter ? (
          <p className="text-[12px] text-gray-500 mt-0.5">Chapter {chapter}</p>
        ) : (
          <p className="text-[12px] text-amber-500 font-medium mt-0.5">Chưa có chap</p>
        )}
      </div>
    </figure>
  );
};

export default CardStories;
