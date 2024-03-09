import React, { useRef, useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faCaretLeft,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import CardStories from "../components/cardStories";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../layout/DarkModeSlice";

import "./style.css";
import axios from "axios";
import { Link } from "react-router-dom";

const TrendStoriesCpn = () => {
  const isDarkModeEnable = useSelector(selectDarkMode);

  const [storiesData, setStoriesData] = useState([]);
  const [slug, setSlug] = useState("hoan-thanh");
  // sate

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `https://otruyenapi.com/v1/api/danh-sach/${slug}`
      );

      if (res.data) {
        setStoriesData(res.data.data);
      }
    };
    fetchData();
  }, [slug]);
  console.log(storiesData);

  const containerRef = useRef(null);

  const scroll = (scollOffset) => {
    containerRef.current.scrollLeft += scollOffset;
  };
  const hotButton = (
    <button className="hot-button w-2/6 h-[10%] bg-[#FF4500] text-white text-xs shadow-md rounded-md font-medium uppercase absolute top-1 right-1">
      Hot
    </button>
  );
  return (
    <div
      className={`${
        isDarkModeEnable ? "bg-bg_dark_light text-white" : "bg-white"
      } h-fit shadow-lg `}
    >
      <div
        className={` ${
          isDarkModeEnable ? "bg-[#3A64C2]" : "bg-primary-color"
        } py-1 h-12 flex items-center justify-between px-4 text-white`}
      >
        <button className=" w-32 h-4/5 bg-[#222222] flex items-center justify-center rounded-lg">
          <FontAwesomeIcon icon={faFire} className="mr-2" /> Xu hướng
        </button>
        <div className="flex gap-2">
          <div>
            <FontAwesomeIcon
              icon={faCaretLeft}
              size="xl"
              className="mr-3 cursor-pointer"
              onClick={() => scroll(-100)}
            />
            <FontAwesomeIcon
              icon={faCaretRight}
              size="xl"
              className="cursor-pointer"
              onClick={() => scroll(+100)}
            />
          </div>
          <Link to="/all-stories">
            <button className=" w-32 h-full font-semibold text-black bg-[#E6F4FF] flex items-center justify-center rounded-lg">
              Xem tất cả
            </button>
          </Link>
        </div>
      </div>
      <div
        className=" container-trendStrories h-72 relative p-4 flex overflow-x-scroll scroll-none w-full transition-transform duration-300"
        ref={containerRef}
      >
        {storiesData.items?.map((item, index) => {
          const timeAgo = formatDistanceToNow(new Date(item.updatedAt), {
            addSuffix: true,
            locale: vi,
          });
          const trimmedTimeAgo = timeAgo.replace(/^khoảng\s/, "");
          // const newestChapter = layChapterMoiNhat(item);
          return (
            <div className="">
              <div className="flex flex-col justify-center items-center gap-2">
                <CardStories
                  key={item._id}
                  id={item._id}
                  title={item.name}
                  img={`https://img.otruyenapi.com${storiesData.seoOnPage.og_image?.[index]}`}
                  slug={item.slug}
                  time={trimmedTimeAgo}
                  hot
                />
                {/* <p className='text-sm'>Chap {(newestChapter.chapter_id)}</p> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendStoriesCpn;
