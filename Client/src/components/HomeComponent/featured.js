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
import { Data } from "../../services/Data";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../layout/DarkModeSlice";
import axios from "axios";
import { storiesDataft } from "../../services/apiStoriesRequest";

const Featured = ({ dark }) => {
  const isDarkModeEnable = useSelector(selectDarkMode);
  // sate
  const [storiesData, setStoriesData] = useState([]);
  const [storiesFT, setStoriesFT] = useState([]);
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState("truyen-moi");
  const [readHistory, setReadHistory] = useState();
  const [selectedButton, setSelectedButton] = useState("homnay");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/history/get-all`
        );
        if (res.data) {
          setReadHistory(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  console.log(readHistory);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://otruyenapi.com/v1/api/danh-sach/${slug}`
        );
        if (res.data) {
          setStoriesData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await storiesDataft();
        setStoriesFT(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  const handleSectionClick = (sectionSlug) => {
    setSlug(sectionSlug);
  };

  const handleClick = (button) => {
    setSelectedButton(button);
  };
  const renderList = () => {
    const today = new Date();
    const currentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ); // Lấy ngày hiện tại mà không có giờ, phút, giây
    switch (selectedButton) {
      case "homnay":
        return readHistory?.slice(0, 10).filter((story) => {
          const storyDate = new Date(story.timestamp);
          const today = new Date(); // Lấy ngày hôm nay
          return (
            storyDate.getFullYear() === today.getFullYear() &&
            storyDate.getMonth() === today.getMonth() &&
            storyDate.getDate() === today.getDate()
          );
        });

      case "tuannay":
        const lastWeek = new Date(currentDate);
        lastWeek.setDate(lastWeek.getDate() - 7); // Ngày của tuần trước
        return readHistory?.slice(0, 10).filter((story) => {
          const storyDate = new Date(story.timestamp);
          return storyDate >= lastWeek && storyDate <= currentDate;
        });
      case "thangnay":
        const firstDayOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        ); // Ngày đầu tiên của tháng
        return readHistory?.slice(0, 10).filter((story) => {
          const storyDate = new Date(story.timestamp);
          return storyDate >= firstDayOfMonth && storyDate <= currentDate;
        });
      default:
        return [];
    }
  };
  console.log(renderList());
  return (
    <div className="phone:flex-row lg:flex tablet:mx-6 lg:mx-14  mt-4 ">
      <Helmet>
        <title>Trang chủ - Đọc truyện 5s</title>
        <meta
          name="description"
          content="Khám phá những câu chuyện nổi bật mới nhất trên Đọc truyện 5s. Đọc những câu chuyện mới, tìm những câu chuyện đã hoàn thành và khám phá những bản phát hành sắp tới."
        />
      </Helmet>
      <div
        className={`${
          isDarkModeEnable ? "bg-bg_dark_light text-text_darkMode" : "bg-white"
        } lg:w-[70%] pl-3.5 shadow-lg `}
      >
        <div className="flex border-b-2 border-gray-200 w-full py-2 font-semibold">
          <div className="h-12 flex items-center phone:h-14 phone:w-full ">
            <FontAwesomeIcon
              icon={faStarOfLife}
              color="#5383EE"
              className="transition transform hover:rotate-180"
            />
            <button
              className={`${
                slug == "truyen-moi"
                  ? "bg-primary-color text-white"
                  : "bg-white text-primary-color"
              } 
                 mr-7 ml-4  flex justify-center items-center rounded-sm h-5/6 p-2`}
              onClick={() => handleSectionClick("truyen-moi")}
            >
              MỚI CẬP NHẬT
            </button>
            <button
              className={`${
                slug == "hoan-thanh"
                  ? "bg-primary-color text-white"
                  : "bg-white text-primary-color"
              } 
                      mr-7 ml-4 flex justify-center items-center rounded-sm h-5/6 p-2  uppercase`}
              onClick={() => handleSectionClick("hoan-thanh")}
            >
              <p>Truyện đã hoàn thành</p>
            </button>
          </div>
        </div>
        <div className=" grid  phone:grid-cols-2 phone:gap-2 tablet:grid-cols-4 lg:grid-cols-3 desktop:grid-cols-4 lg:gap-4 mt-3 place-items-center">
          {storiesData.items?.map((item, index) => {
            const timeAgo = formatDistanceToNow(new Date(item.updatedAt), {
              addSuffix: true,
              locale: vi,
            });
            const trimmedTimeAgo = timeAgo.replace(/^khoảng\s/, "");
            return (
              <>
                <CardStories
                  key={item._id}
                  id={item._id}
                  title={item.name}
                  img={`https://img.otruyenapi.com${storiesData.seoOnPage.og_image?.[index]}`}
                  slug={item.slug}
                  time={trimmedTimeAgo}
                  chapter={item.chaptersLatest[0].chapter_name}
                  nomarl
                />
                {/* <Link to={`/detail/${item.slug}`}> */}
                {/* <figure className='h-72 mr-4 relative cursor-pointer'>
                    <div className='relative h-52 w-44 overflow-hidden'>
                        <img
                            src={`https://img.otruyenapi.com${storiesData.seoOnPage.og_image?.[index]}`}
                            alt='anh'
                            className='w-full h-full object-cover transition-all duration-500 transform hover:scale-125'
                        /> */}
                {/* <div className='bg-black h-1/6 opacity-50 w-full absolute bottom-0 text-white text-sm flex items-center justify-start p-1'>
                            <p className='mr-2'><FontAwesomeIcon icon={faBookmark} /> {saves}</p>
                            <p><FontAwesomeIcon icon={faEye} />{views} </p>
                        </div> */}
                {/* </div>
                    <div>
                            <p className={`${isDarkModeEnable ? "text-[#CCCCCC]" : "text-black "} font-semibold mt-3`}>{item.name}</p>
                    </div>
                            <button className="promotion-button w-fit p-1 m-1 bg-primary-color text-white text-xs shadow-md rounded-md font-medium absolute top-1 left-1">{trimmedTimeAgo}</button>
                            <button className="promotion-button w-fit p-1 m-1 bg-[#FF4500] text-white text-xs shadow-md rounded-md font-medium absolute top-1 right-1">Chương: {item.chaptersLatest[0].chapter_name}</button>
                </figure>
        </Link> */}
                {/* <p className='text-sm'>Chap {(newestChapter.chapter_id)}</p> */}
              </>
            );
          })}
        </div>
        <div className="w-full my-10 flex justify-center items-center hover:text-primary-color">
          <Link to="/all-stories">
            <button className="w-24 mb-4 h-10 border-[1px] border-gray-300">
              Xem Thêm
            </button>
          </Link>
        </div>
      </div>
      <div className="h-fit lg:ml-6 lg:w-[28%]">
        <div
          className={` ${
            isDarkModeEnable
              ? "bg-bg_dark_light text-text_darkMode"
              : "bg-white"
          } shadow-lg h-fit `}
        >
          <div className="w-[40%] uppercase text-primary-color p-3 border-b-2 border-gray-200">
            <FontAwesomeIcon icon={faFire} className="mr-2" />
            Xem nhiều
          </div>
          <div className="p-3">
            <div
              className={` ${
                isDarkModeEnable
                  ? "bg-[#333333] text-text_darkMode"
                  : "bg-[#F1F1F1]"
              } m-auto flex justify-center items-center h-10 rounded-md font-normal`}
            >
              <FilterButton
                text="Hôm nay"
                isSelected={selectedButton === "homnay"}
                onClick={() => handleClick("homnay")}
                isDarkModeEnable
              />
              <FilterButton
                text="Tuần này"
                isSelected={selectedButton === "tuannay"}
                onClick={() => handleClick("tuannay")}
                isDarkModeEnable
              />
              <FilterButton
                text="Tháng này"
                isSelected={selectedButton === "thangnay"}
                onClick={() => handleClick("thangnay")}
                isDarkModeEnable
              />
            </div>
            <div>
              {renderList()
                ?.sort((a, b) => b.readCount - a.readCount)
                .map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex p-3 justify-start cursor-pointer border-b-2 border-gray-200"
                    >
                      <img
                        src={`https://img.otruyenapi.com/uploads/${item.storyInfo?.seoOnPage.og_image[0]}`}
                        alt="anh"
                        className="h-20"
                      />
                      <div className="ml-4 h-20 flex flex-col justify-around">
                        <div className="flex-1">
                          <Link to={`/detail/${item.slug}`}>
                            <p>{item.storyInfo.item.name}</p>
                          </Link>
                          <div className="flex justify-between gap-1 items-center text-xs">
                            <p className="font-semibold text-[#888888] mr-1 ">
                              Thể loại:
                            </p>
                            <div className="flex flex-1">
                              {item?.category
                                ?.slice(0, 3)
                                .map((cate, index) => {
                                  return (
                                    <p
                                      key={index}
                                      className={`mr-1 rounded-xl  text-primary-color text-sm hover:text-blue-400`}
                                    >
                                      {cate.name}
                                    </p>
                                  );
                                })}
                            </div>
                          </div>
                          <div>
                            <p>
                              <FontAwesomeIcon icon={faEye} />{" "}
                              {item.readCount.toLocaleString()}{" "}
                            </p>
                          </div>
                        </div>
                        <div className="flex font-light text-sm">
                          {/* <p className="mr-2">
                          <FontAwesomeIcon icon={faBookmark} /> {item.saves}
                        </p>
                        <p>
                          <FontAwesomeIcon icon={faEye} />{" "}
                          {item.views.toLocaleString()}{" "}
                        </p> */}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {/* new strories */}
        <div
          className={`${
            isDarkModeEnable
              ? "bg-bg_dark_light text-text_darkMode"
              : "bg-white"
          } h-fit shadow-lg mt-10`}
        >
          <div className="w-full font-medium uppercase text-primary-color p-3 border-b-2 border-gray-200">
            <FontAwesomeIcon icon={faCalendarDay} className="mr-2" />
            Truyện sắp ra mắt
          </div>
          {storiesFT.items?.slice(0, 10).map((item, index) => {
            const timeAgo = formatDistanceToNow(new Date(item.updatedAt), {
              addSuffix: true,
              locale: vi,
            });
            const trimmedTimeAgo = timeAgo.replace(/^khoảng\s/, "");
            return (
              <div
                key={item._id}
                className="flex p-3 justify-start  border-b-2 border-gray-200"
              >
                <img
                  src={`https://img.otruyenapi.com${storiesFT.seoOnPage.og_image?.[index]}`}
                  alt="anh"
                  className="h-20"
                />
                <div className="ml-4 w-full h-full flex flex-col justify-around">
                  <div className="flex-1">
                    <Link to={`/detail/${item.slug}`}>
                      <p className="text-lg cursor-pointer">{item.name}</p>
                    </Link>
                    <div className="flex text-base italic">
                      <p>Chapter {item.chaptersLatest[0].chapter_name}</p>
                    </div>
                  </div>
                  <div className="flex justify-end text-sm">
                    <p className="mr-2 text-gray-400 italic">
                      {trimmedTimeAgo}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
const FilterButton = ({ text, isSelected, onClick, isDarkModeEnable }) => (
  <button
    onClick={onClick}
    className={`h-8 w-24 rounded-sm ${
      isDarkModeEnable ? "  border-none" : ""
    } ${
      isSelected
        ? "bg-primary-color text-text_darkMode"
        : "border-2 border-gray-300"
    }`}
  >
    {text}
  </button>
);

export default Featured;
