import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
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

const Featured = ({ dark }) => {
  const isDarkModeEnable = useSelector(selectDarkMode);
  // sate
  const [storiesData, setStoriesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState("truyen-moi");



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
        // Xử lý lỗi ở đây, ví dụ:
        console.error("Error fetching data:", error);
        // Có thể hiển thị thông báo lỗi cho người dùng hoặc xử lý theo cách phù hợp khác
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleSectionClick = (sectionSlug) => {
    setSlug(sectionSlug);
  };
  console.log(storiesData);
  const [selectedButton, setSelectedButton] = useState("homnay");
  const [stories] = useState([
    {
      id: 1,
      imageUrl:
        "https://doctruyen5s.top/uploads/covers/ngay-tan-the-ta-nhan-duoc-ty-le-rot-do-gap-100-lan.jpg",
      title: "Truyện 1",
      genre: "Kinh dị",
      saves: 50,
      views: 1000,
      dateAdded: "2023-10-10",
    },
    {
      id: 2,
      imageUrl:
        "https://doctruyen5s.top/uploads/covers/nhan-vat-phan-dien-dai-su-huynh-tat-ca-cac-su-muoi-deu-la-benh-kieu.jpg",
      title: "Truyện 2",
      genre: "Hài hước",
      saves: 30,
      views: 800,
      dateAdded: "2023-10-09",
    },
    {
      id: 3,
      imageUrl:
        "https://doctruyen5s.top/uploads/covers/ngay-tan-the-ta-nhan-duoc-ty-le-rot-do-gap-100-lan.jpg",
      title: "Truyện 3",
      genre: "Tình cảm",
      saves: 20,
      views: 1200,
      dateAdded: "2023-10-08",
    },
    // Thêm các truyện khác tương tự
  ]);
  const truyenData = useSelector((state) => state.stories.truyenData);

  const handleClick = (button) => {
    setSelectedButton(button);
  };
  console.log(Data);
  const renderList = () => {
    switch (selectedButton) {
      case "homnay":
        return Data.filter((story) => story.date_added === "2023-10-10");
      case "tuannay":
        return Data.filter(
          (story) => new Date(story.date_added) >= new Date("2023-10-04")
        );
      case "thangnay":
        return Data.filter(
          (story) =>
            new Date(story.date_added).getMonth() === new Date().getMonth()
        );
      default:
        return [];
    }
  };
  console.log(renderList());

  // function layChapterMoiNhat(tuaTruyen) {
  //   return tuaTruyen.chapters.reduce((newestChapter, chapter) => (
  //     chapter.chapter_id > (newestChapter ? newestChapter.chapter_id : -1) ? chapter : newestChapter
  //   ), null);
  // }

  return (
    <div className="phone:flex-row lg:flex tablet:mx-6 lg:mx-14  mt-4 ">
      <div
        className={`${
          isDarkModeEnable ? "bg-bg_dark_light text-text_darkMode" : "bg-white"
        } lg:w-[70%] pl-3.5 shadow-lg `}
      >
        <div className="flex border-b-2 border-gray-200 w-4/5 py-2 font-semibold">
          <div className="h-12 flex items-center ">
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
            console.log(item.chaptersLatest.chapter_name);
            return (
              <>
                <div className="flex flex-col justify-center items-center gap-2">
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
                  {/* <p className='text-sm'>Chap {(newestChapter.chapter_id)}</p> */}
                </div>
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
              {renderList().map((item) => {
                return (
                  <div
                    key={item.id}
                    className="flex p-3 justify-start cursor-pointer border-b-2 border-gray-200"
                  >
                    <img src={item.image} alt="anh" className="h-20" />
                    <div className="ml-4 h-20 flex flex-col justify-around">
                      <div className="flex-1">
                        <p>{item.title}</p>
                        <div className="flex justify-between text-xs">
                          <p className="font-semibold text-[#888888] mr-1 ">
                            Thể loại:
                          </p>{" "}
                          <p className=""> {item.genres}</p>
                        </div>
                      </div>
                      <div className="flex font-light text-sm">
                        <p className="mr-2">
                          <FontAwesomeIcon icon={faBookmark} /> {item.saves}
                        </p>
                        <p>
                          <FontAwesomeIcon icon={faEye} />{" "}
                          {item.views.toLocaleString()}{" "}
                        </p>
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
          <div className="w-[50%] uppercase text-primary-color p-3 border-b-2 border-gray-200">
            <FontAwesomeIcon icon={faCalendarDay} className="mr-2" />
            Truyện mới
          </div>
          {stories.map((item) => {
            const timeAgo = formatDistanceToNow(new Date(item.dateAdded), {
              addSuffix: true,
            });
            return (
              <div className="flex p-3 justify-start  border-b-2 border-gray-200">
                <img src={item.imageUrl} alt="anh" className="h-20" />
                <div className="ml-4 w-full h-20 flex flex-col justify-around">
                  <div className="flex-1">
                    <p className="text-lg">{item.title}</p>
                    <div className="flex text-base italic">
                      <p>Chapter 2 - con rối giấy</p>
                    </div>
                  </div>
                  <div className="flex justify-end text-sm">
                    <p className="mr-2 text-gray-400 italic">{timeAgo}</p>
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
