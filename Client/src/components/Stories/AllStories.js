import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../layout/DarkModeSlice";
import { Data } from "../../services/Data";
//cpn
import PopularSection from "./PopularSection";
import CardStories from "../components/cardStories";
// icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faBookmark,
  faEye,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
// layout
import NavBar from "../layout/Navbar";
import Footer from "../layout/footer";
import { useEffect } from "react";
import axios from "axios";
import { Skeleton } from "antd";
import Pagination from "../components/pagination";
const AllStories = () => {
  const darkMode = useSelector(selectDarkMode);
  // sate
  const [storiesData, setStoriesData] = useState([]);
  const [slug, setSlug] = useState("truyen-moi");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 24;
  const sortedData = [...Data].sort((a, b) => b.views - a.views);
  useEffect(() => {
    fetchData();
  }, [slug, currentPage]); // Fetch data when slug or currentPage changes
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://otruyenapi.com/v1/api/danh-sach/${slug}`,
        {
          params: {
            page: currentPage,
            totalItemsPerPage: itemsPerPage
          }
        }
      );
  
      if (res.data) {
        console.log(res.data.data.params.pagination.totalItemsPerPage)
        setStoriesData(res.data.data);
        setTotalPages(Math.ceil(res.data.data.params.pagination.totalItems / res.data.data.params.pagination.totalItemsPerPage));
      }
    } catch (error) {
      // Xử lý lỗi ở đây
    } finally {
      setLoading(false);
    }
  };

  console.log(storiesData);
  console.log(totalPages)

  const handleSectionClick = (sectionSlug) => {
    setSlug(sectionSlug);
  };
  //   phan trang (pagination)
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Tạo phạm vi của các trang
  const getPageRange = () => {
    const pageRange = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    for (let i = startPage; i <= endPage; i++) {
      pageRange.push(i);
    } 
    return pageRange;
  };
  
  
  return (
    <div
      className={`${
        darkMode ? "bg-bg_dark text-text_darkMode" : "bg-bg_light"
      }`}
    >
      <NavBar />
      <div
        className={`
                grid phone:grid-cols-1 tablet:grid-cols-1 laptop:grid-cols-7 gap-1 w-[95%]  mt-6 m-auto
            `}
      >
        <div className="laptop:h-screen col-span-1  font-medium text-base text-black  bg-white ">
          <div className="grid phone:grid-cols-2 tablet:grid-cols-4 laptop:grid-cols-1 laptop:h-[40%] phone:p-1">
            <div
              className={`${
                slug == "truyen-moi" ? "bg-[#E6F4FF] text-[#1677FF]" : ""
              } hover:bg-[#F0F0F0] rounded-xl w-[90%] m-auto p-3 cursor-pointer 
              flex gap-2 items-center laptop:mt-5 phone:mx-3 laptop:mx-2`}
              onClick={() => handleSectionClick("truyen-moi")}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                class="w-6 h-6 mr-2 ml-1"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M319.61 20.654c13.145 33.114 13.144 33.115-5.46 63.5 33.114-13.145 33.116-13.146 63.5 5.457-13.145-33.114-13.146-33.113 5.457-63.498-33.114 13.146-33.113 13.145-63.498-5.459zM113.024 38.021c-11.808 21.04-11.808 21.04-35.724 24.217 21.04 11.809 21.04 11.808 24.217 35.725 11.808-21.04 11.808-21.04 35.724-24.217-21.04-11.808-21.04-11.808-24.217-35.725zm76.55 56.184c-.952 50.588-.95 50.588-41.991 80.18 50.587.95 50.588.95 80.18 41.99.95-50.588.95-50.588 41.99-80.18-50.588-.95-50.588-.95-80.18-41.99zm191.177 55.885c-.046 24.127-.048 24.125-19.377 38.564 24.127.047 24.127.046 38.566 19.375.047-24.126.046-24.125 19.375-38.564-24.126-.047-24.125-.046-38.564-19.375zm-184.086 83.88c-1.191.024-2.36.07-3.492.134-18.591 1.064-41.868 8.416-77.445 22.556L76.012 433.582c78.487-20.734 132.97-21.909 170.99-4.615V247.71c-18.076-8.813-31.79-13.399-46.707-13.737a91.166 91.166 0 0 0-3.629-.002zm122.686 11.42c-2.916-.026-5.81.011-8.514.098-12.81.417-27.638 2.215-45.84 4.522V427.145c43.565-7.825 106.85-4.2 171.244 7.566l-39.78-177.197c-35.904-8.37-56.589-11.91-77.11-12.123zm2.289 16.95c18.889.204 36.852 2.768 53.707 5.02l4.437 16.523c-23.78-3.75-65.966-4.906-92.467-.98l-.636-17.805c11.959-2.154 23.625-2.88 34.959-2.758zm-250.483 4.658l-10.617 46.004h24.094l10.326-46.004H71.158zm345.881 0l39.742 177.031 2.239 9.973 22.591-.152-40.855-186.852h-23.717zm-78.857 57.82c16.993.026 33.67.791 49.146 2.223l3.524 17.174c-32.645-3.08-72.58-2.889-102.995 0l-.709-17.174c16.733-1.533 34.04-2.248 51.034-2.223zm-281.793 6.18l-6.924 30.004h24.394l6.735-30.004H56.389zm274.418 27.244c4.656.021 9.487.085 14.716.203l2.555 17.498c-19.97-.471-47.115.56-59.728 1.05l-.7-17.985c16.803-.493 29.189-.828 43.157-.766zm41.476.447c8.268.042 16.697.334 24.121.069l2.58 17.74c-8.653-.312-24.87-.83-32.064-.502l-2.807-17.234a257.25 257.25 0 0 1 8.17-.073zm-326.97 20.309l-17.985 77.928 25.035-.17 17.455-77.758H45.313zm303.164 11.848c19.608-.01 38.66.774 56.449 2.572l2.996 20.787c-34.305-4.244-85.755-7.697-119.1-3.244l-.14-17.922c20.02-1.379 40.186-2.183 59.795-2.193zm-166.606 44.05c-30.112.09-67.916 6.25-115.408 19.76l-7.22 2.053 187.759-1.27v-6.347c-16.236-9.206-37.42-14.278-65.13-14.196zm134.41 6.174c-19.63.067-37.112 1.439-51.283 4.182v10.064l177.594-1.203c-44.322-8.634-89.137-13.17-126.31-13.043zM26 475v18h460v-18H26z"></path>
              </svg>
              Truyện mới
            </div>
            <div
              className={`${
                slug == "sap-ra-mat" ? "bg-[#E6F4FF] text-[#1677FF]" : ""
              } hover:bg-[#F0F0F0] rounded-xl w-[90%] m-auto p-3 cursor-pointer 
              flex gap-2 items-center laptop:mt-5 phone:mx-3 laptop:mx-2`}
              onClick={() => handleSectionClick("sap-ra-mat")}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                class="w-6 h-6 mr-2 ml-1"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M256.313 29.844c-16.47-.022-32.95 2.724-49.282 8.343l5.69 16.563L17.53 123l6.19 17.656L231.405 68.03l-5.562-15.905c19.548-4.75 38.93-4.86 58.5-.5l-5.72 16.406 207.688 72.626L492.47 123 299.624 55.562l5.906-17.374c-16.29-5.517-32.75-8.322-49.217-8.344zm-.657 49.593L46.25 152.844l42.406 29.53c70.69-11.9 160.54 31.24 166.906-90.25 2.175 32.524 10.254 53.188 22.282 66.282 6.658 7.576 14.5 12.432 23.687 15.688.04.015.086.016.126.03.216.077.44.145.656.22 33.978 12.23 80.744 1.187 121.344 8.03l41.406-29.155-209.406-73.782zm.47 81.032c-.263.413-.516.842-.782 1.25-12.194 18.6-29.79 28.466-48.656 33.03-3.486.843-7.013 1.528-10.594 2.094l41.437 74.094-67.25 16.78 31.345 61.594-61.813-54L283.938 496.75l-61.875-143.625 52.438 69.5L235.03 320l58.5-10.094-17.092-52.75 93.468 141.28-81.47-196.748 56.845 83.406L323 197.75c-5.9-.68-11.71-1.63-17.375-3-18.865-4.564-36.494-14.43-48.688-33.03-.27-.413-.548-.832-.812-1.25z"></path>
              </svg>
              Sắp ra mắt
            </div>
            <div
              className={`${
                slug == "dang-phat-hanh" ? "bg-[#E6F4FF] text-[#1677FF]" : ""
              }  hover:bg-[#F0F0F0] rounded-xl w-[90%] m-auto p-3 cursor-pointer 
              flex gap-2 items-center laptop:mt-5 phone:mx-3 laptop:mx-2`}
              onClick={() => handleSectionClick("dang-phat-hanh")}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                class="w-6 h-6 mr-2 ml-1"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                …
                <path d="M105.063 18.03c71.2 31.42 129.344 86.117 152.5 155.75 23.155-69.633 78.953-124.33 150.03-155.75h-36.156c-53.802 15.416-89.834 45.46-107.25 92 2.238-52.074 18.275-78.34 40.25-92H203.094c21.98 13.66 38.044 39.926 40.28 92-17.415-46.54-53.446-76.584-107.25-92h-31.06zm386.968 4.157c-16.65 228.426-81.874 410.467-209.06 398.907 41.547 39.438 83.78 62.385 122.342 72.22l86.72-.002v-32.968c-27.303 13.718-52.895 14.545-130.938-13.438 68.627.614 101.042-14.37 130.937-51.656v-46.063c-20.77 32.913-58.994 60.416-130.936 75.438 64.71-34.947 107.585-89.884 130.937-180.844V22.188zM18.69 71.344V255.47c23.96 84.017 65.86 135.732 127.75 169.155-68.45-14.292-106.347-39.89-127.75-70.688v45.125c29.053 34.484 61.523 48.437 127.75 47.844-75.03 26.903-101.557 27.177-127.75 14.97v31.437h82.28c38.562-9.834 80.796-32.78 122.344-72.22-117.915 10.718-182.556-144.97-204.625-349.75zm113.687 82.406v176.28l4.875 2.658 112.063 60.875 4.468 2.406 4.44-2.408 112.06-60.875 4.908-2.656V153.75H356.5v165.188l-102.75 55.78-102.688-55.78V153.75h-18.687zm37.53.188v151.406l73.532 41.437V198.5l-73.53-44.563zm167.72 0l-75.5 45.78v148.188l75.5-42.562V153.938z"></path>
              </svg>
              Đang phát hành
            </div>
            <div
              className={`${
                slug == "hoan-thanh" ? "bg-[#E6F4FF] text-[#1677FF]" : ""
              }  hover:bg-[#F0F0F0] rounded-xl w-[90%] m-auto p-3 cursor-pointer 
              flex gap-2 items-center laptop:mt-5 phone:mx-3 laptop:mx-2`}
              onClick={() => handleSectionClick("hoan-thanh")}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                class="w-6 h-6 mr-2 ml-1"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M263.813 18.594c-50.387 12.75-80.69 66.325-50.813 111.22 22.477 33.773 44.967 61.167 8.75 79.06-23.353 11.54-50.027-16.454-46.125-49.28 4.812-40.485-18.705-79.927-46.125-88.188 46.237 106.42-43.46 176.998-24.53 77.094-30.286 16.095-32.784 59.017-11.25 122.72-40.372-17.2-55.07-66.767-38.282-120.564-35.866 28.35-53.3 130.904-14.626 183.47C136.425 464.08 248.156 496.343 268 496.343c21.144 0 117.334-33.716 189.594-115.125 41.782-47.074 50.926-168.9 9.22-243.658 5.98 25.335-6.117 76.786-33.845 94.032 4.998-57.774-3.913-140.944-36.69-171.53 32.622 172.802-93.01 152.202-48.374 99.53 29.51-34.825-.17-102.5-17.5-112.375 10.894 42.12-14.24 69.676-54.72 61.436-27.252-5.547-44.743-44.957-11.873-90.062zm-115.157 211.47h18.688V395.25l102.72 55.813L372.78 395.25V230.094h18.69v176.28l-4.908 2.657L274.5 469.876l-4.438 2.438-4.468-2.438L153.53 409.03l-4.874-2.655V230.062zm37.53.217l73.533 44.532v148.313l-73.533-41.438V230.28zm167.72 0v151.407l-75.5 42.563V276.03l75.5-45.75z"></path>
              </svg>
              Hoàn thành
            </div>
          </div>
        </div>
        <div
          className={`${
            darkMode ? "bg-bg_dark_light text-text_darkMode" : "bg-white"
          } laptop:col-span-4  p-2`}
        >
          <div className="py-1 h-12 flex items-center  justify-between text-lg font-semibold text-primary-color border-b-[1px] border-[#F0F0F0] ">
            <p>All Manga</p>
          </div>

          <div
            className={`${
              darkMode ? "bg-bg_dark_light text-text_darkMode" : "bg-white"
            } 
                      mt-10  grid  phone:grid-cols-2 phone:gap-2 tablet:grid-cols-3 lg:grid-cols-3 desktop:grid-cols-4 lg:gap-1 place-items-center
                    `}
          >
            {loading && <Skeleton avatar active />}

            {storiesData.items?.map((item, index) => {
              const timeAgo = formatDistanceToNow(new Date(item.updatedAt), {
                addSuffix: true,
                locale: vi,
              });
              const trimmedTimeAgo = timeAgo.replace(/^khoảng\s/, "");
              // const newestChapter = layChapterMoiNhat(item);
              {
                loading && <Skeleton loading={loading} avatar active />;
              }

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
          <div className='p-4 flex justify-center items-center w-full border-t-[1px] mt-10'>
              <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} getPageRange={getPageRange}/>
          </div>
        </div>

        {/* Pho bien */}
        {/* <div className={`${darkMode? "bg-bg_dark_light text-text_darkMode": "bg-white"} h-fit shadow-lg flex-1`}> */}
        <PopularSection darkMode={darkMode} sortedData={sortedData} />
        {/* </div> */}
      </div>
      <Footer />
    </div>
  );
};


export default AllStories;
