import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../layout/DarkModeSlice";
import { Data } from "../../services/Data";
import CardStories from "../components/cardStories";
// icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faBookmark,
  faEye,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
// layout
import NavBar from "../layout/Navbar";
import Footer from "../layout/footer";
import { Checkbox } from "antd";
import axios from "axios";
import PopularSection from "./PopularSection";
import { getAllCategory } from "../../services/apiStoriesRequest";

const FilterStories = () => {
  const darkMode = useSelector(selectDarkMode);
  // sate
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isCategory, setIsCategory] = useState([]);
  const [genres, setGenres] = useState();
  const [gridCols, setGridCols] = useState(6);

  //fetch
  const [selectedCategory, setSelectedCategory] = useState('action');

  useEffect(() => {
    // setGenres(getAllCategory())
    const fetchDataGenres = async () => {
      const res = await getAllCategory();
      if (res) {
        setGenres(res);
      }
    };
    fetchDataGenres();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://otruyenapi.com/v1/api/the-loai/${selectedCategory}`
        );

        if (res.data) {
          setIsCategory(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory]);
  console.log(genres);



  const sortedData = [...Data].sort((a, b) => b.views - a.views);
  function layChapterMoiNhat(tuaTruyen) {
    return tuaTruyen.chapters.reduce(
      (newestChapter, chapter) =>
        chapter.chapter_id > (newestChapter ? newestChapter.chapter_id : -1)
          ? chapter
          : newestChapter,
      null
    );
  }

  //   phan trang (pagination)
  const truyensPerPage = 10;
  const indexOfLastTruyen = currentPage * truyensPerPage;
  const indexOfFirstTruyen = indexOfLastTruyen - truyensPerPage;
  const currentTruyens = Data.slice(indexOfFirstTruyen, indexOfLastTruyen);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(Data.length / truyensPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleCategoryChange = (e,slug) => {
    e.preventDefault();
    setSelectedCategory(slug);
  };
  console.log(isCategory)
  return (
    <div
      className={`${
        darkMode ? "bg-bg_dark_light text-text_darkMode" : "bg-bg_light"
      } `}
    >
      <NavBar />
      <div
        className={`
                lg:flex gap-4 w-[90%]  mt-6 m-auto
            `}
      >
        <div
          className={`${
            darkMode ? "bg-bg_dark_light text-text_darkMode" : "bg-white"
          } lg:w-[72%] p-2`}
        >
          <div className="py-1 h-12 flex items-center  justify-between text-lg font-semibold text-primary-color border-b-[1px] border-[#F0F0F0] ">
            <p>
              {" "}
              <FontAwesomeIcon icon={faFilter} /> Tìm kiếm nâng cao
            </p>
          </div>
          <div
            className={`${
              darkMode ? "bg-bg_dark_light text-text_darkMode" : "bg-white"
            } 
                       mt-10
                    `}
          >
            <div className="grid phone:grid-cols-2 tablet:grid-cols-3 lg:grid-cols-4 gap-2">
              {/* <button>ẩn</button> */}
            {genres?.items.map((item) => {
                  return <div onClick={(e)=>handleCategoryChange(e,item.slug)} className="flex items-center border-b-2 p-3 font-medium hover:text-[#AE4AD9] cursor-pointer">{item.name}</div>;
                })}
            </div>
            <div className="grid tablet:grid-cols-2 gap-5 mt-10">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-lg">Số chương</label>
                <select className="py-2 border-[1px] w-[50%] rounded-md">
                  <option value={"0"}>{">"}=0</option>
                  <option value={"10"}>{">"}=10</option>
                  <option value={"50"}>{">"}=50</option>
                  <option value={"100"}>{">"}=100</option>
                  <option value={"500"}>{">"}=500</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <label className="font-semibold text-lg">Trạng thái</label>
                <select className="py-2 border-[1px] w-[50%] rounded-md">
                  <option value={"all"}>Tất cả</option>
                  <option value={"on-going"}>Đang hoàn thành</option>
                  <option value={"hold"}>Tạm ngưng</option>
                  <option value={"completed"}>Hoàn thành</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <label className="font-semibold text-lg">Giới tính</label>
                <select className="py-2 border-[1px] w-[50%] rounded-md">
                  <option value={"male"}>Nam</option>
                  <option value={"female"}>Nữ</option>
                  <option value={"other"}>Khác</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <label className="font-semibold text-lg">Sắp xếp</label>
                <select className="py-2 border-[1px] w-[50%] rounded-md">
                  <option value={"default"}>Mặc định</option>
                  <option value={"new-update"}>Mới cập nhật</option>
                  <option value={"most-view"}>Xem nhiều</option>
                  <option value={"high-score"}>Đánh giá cao</option>
                  <option value={"az"}>Từ A-Z</option>
                  <option value={"za"}>Từ Z-A</option>
                  <option value={"new"}>Mới nhất</option>
                  <option value={"old"}>Cũ nhất</option>
                </select>
              </div>
            </div>
            <button className="bg-[#BD10E0] w-full text-center font-bold rounded-md cursor-pointer hover:bg-[#D360EA] text-white mt-6 p-2 px-2">
              Filter
            </button>
          </div>
          <div
            className={`${
              darkMode ? "bg-bg_dark_light text-text_darkMode" : "bg-white"
            } 
                       mt-10 grid  phone:grid-cols-2 phone:gap-2 tablet:grid-cols-3 lg:grid-cols-4 desktop:grid-cols-5 lg:gap-4 place-items-center
                    `}
          >
            {isCategory.items?.map((item,index) => {
                const timeupa = new Date(item.updatedAt);
                const formattedDateTime = timeupa
                  .toISOString()
                  .replace("T", " ")
                  .replace("Z", "");
                const trimmedTimeAgo = formatDistanceToNow(
                  new Date(item.updatedAt),
                  { addSuffix: true, locale: vi }
                ).replace(/^khoảng\s/, "");
              return (
                <>
                  <div className="flex flex-col justify-center items-center gap-2">
                  <CardStories
                      key={item._id}
                      id={item._id}
                      title={item.name}
                      img={`https://img.otruyenapi.com${isCategory.seoOnPage.og_image[index]}`}
                      slug={item.slug}
                      time={trimmedTimeAgo}
                      timeup={formattedDateTime}
                      // chapter={item.chaptersLatest[0].chapter_name}
                      nomarl
                    />
                  </div>
                </>
              );
            })}
          </div>
          <div className="p-4 w-full border-t-[1px] mt-10">
            <Pagination
              truyensPerPage={truyensPerPage}
              totalTruyens={Data.length}
              paginate={paginate}
              currentPage={currentPage}
              nextPage={nextPage}
              prevPage={prevPage}
            />
          </div>
        </div>

        {/* Pho bien */}
        <div
          className={`${
            darkMode ? "bg-bg_dark_light text-text_darkMode" : "bg-white"
          }  h-fit shadow-lg flex-1`}
        >
            <PopularSection />
        </div>
      </div>
      <Footer />
    </div>
  );
};

const Pagination = ({
  truyensPerPage,
  totalTruyens,
  paginate,
  currentPage,
  nextPage,
  prevPage,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalTruyens / truyensPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <ul className="pagination flex justify-center items-center gap-5">
      <li className="page-item">
        <a href="#" className="page-link" onClick={() => prevPage()}>
          Previous
        </a>
      </li>
      {pageNumbers.map((number) => (
        <li
          key={number}
          onClick={() => paginate(number)}
          className={`page-item ${
            currentPage === number ? "active bg-primary-color text-white" : ""
          } cursor-pointer border-[1px] py-2 px-4`}
        >
          <a href="#" className="page-link">
            {number}
          </a>
        </li>
      ))}
      <li className="page-item">
        <a href="#" className="page-link" onClick={() => nextPage()}>
          Next
        </a>
      </li>
    </ul>
  );
};

export default FilterStories;
