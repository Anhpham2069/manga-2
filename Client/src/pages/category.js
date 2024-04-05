import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../components/layout/DarkModeSlice";
//cpn
import CardStories from "../components/components/cardStories";
// icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faTableCells } from "@fortawesome/free-solid-svg-icons";
// layout
import NavBar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import { useEffect } from "react";
import axios from "axios";
import { Checkbox, Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { getAllCategory } from "../services/apiStoriesRequest";

const apiURLOTruyen = process.env.REACT_APP_API_URL_OTruyen;
const Category = () => {
  console.log(apiURLOTruyen)
  const { slug: initialSlug } = useParams();

  const darkMode = useSelector(selectDarkMode);
  // sate
  const [loading, setLoading] = useState(false);
  const [isCategory, setIsCategory] = useState([]);
  const [genres, setGenres] = useState();
  const [gridCols, setGridCols] = useState(6);

  //fetch
  const [selectedCategory, setSelectedCategory] = useState(initialSlug);

  useEffect(() => {
    // setGenres(getAllCategory())
    const fetchDataGenres = async () => {
      const res = await getAllCategory();
      if (res.data) {
        setGenres(res.data);
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

  const handleCategoryChange = (e,slug) => {
    e.preventDefault();
    setSelectedCategory(slug);
  };
  const handleCategoryChangeMb = (event) => {
    const newSlug = event.target.value;
    setSelectedCategory(newSlug);
  };

  //   phan trang (pagination)

  return (
    <div
      className={`${
        darkMode ? "bg-bg_dark text-text_darkMode" : "bg-bg_light"
      }`}
    >
      <NavBar />
      <div className={`w-[95%]  mt-6 m-auto flex`}>
        <div
          className={`${
            darkMode ? "bg-bg_dark_light text-text_darkMode" : "bg-white"
          } laptop:col-span-1  p-5`}
        >
          <div className="py-2 p-2 h-12 flex items-center  justify-between text-xl font-semibold  border-b-[1px] border-[#F0F0F0] ">
            <p>
              <span className="font-bold text-xl">Thể loại:</span>{" "}
              {isCategory?.titlePage}
            </p>
            <div className="flex gap-5 items-center">
              <div className="flex gap-3 text-slate-500">
                <FontAwesomeIcon
                  size="xl"
                  className="hover:text-primary-color cursor-pointer"
                  icon={faList}
                  onClick={() => setGridCols(1)}
                />
                <FontAwesomeIcon
                  size="xl"
                  className="hover:text-primary-color cursor-pointer"
                  icon={faTableCells}
                  onClick={() => setGridCols(6)}
                />
              </div>
              
            </div>
          </div>
          <select
                className="phone:block tablet:hidden w-full  bg-[#E6F4FF] rounded-xl p-2  my-5 text-primary-color"
                value={selectedCategory}
                onChange={handleCategoryChangeMb}
              >
                {genres?.items.map((item) => {
                  return (
                    <option
                      key={item.slug}
                      value={item.slug}
                      className="bg-[#E6F4FF] text-primary-color"
                      // style={{
                      //   /* Add your custom styling here */
                      //   padding: '8px 12px',
                      //   fontSize: '14px',
                      //   fontWeight:"unset",
                      //   borderRadius: '4px',
                      //   cursor: 'pointer',
                      // }}
                    >
                      {item.name}
                    </option>
                  );
                })}
              </select>
          <div className="flex w-full tablet:p-5">
            <div
              className={`${
                darkMode ? "bg-bg_dark_light text-text_darkMode" : "bg-white"
              } tablet:mt-10 tablet:p-5
               tablet:w-[75%] phone:w-full grid  phone:grid-cols-2 phone:gap-2 tablet:grid-cols-3 laptop:grid-cols-${gridCols} desktop:grid-cols-4 lg:gap-5 place-items-center`}
            >
              {loading && <Skeleton avatar active />}

              {isCategory.items?.map((item, index) => {
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
                    <CardStories
                      key={item._id}
                      id={item._id}
                      title={item.name}
                      img={`https://img.otruyenapi.com${isCategory.seoOnPage.og_image?.[index]}`}
                      slug={item.slug}
                      time={trimmedTimeAgo}
                      timeup={formattedDateTime}
                      // chapter={item.chaptersLatest[0].chapter_name}
                      nomarl
                    />
                  </>
                );
              })}
            </div>
            <div className="flex-1 border-2 p-2 phone:hidden  tablet:block h-fit">
              <div className="border-b-2 font-semibold text-2xl text-primary-color">
                <p>Thể loại</p>
              </div>
              <div className="grid phone:grid-cols-2 tablet:grid-cols-3 lg:grid-cols-2 ">
                {genres?.items.map((item) => {
                  return <div onClick={(e)=>handleCategoryChange(e,item.slug)} className="flex items-center border-b-2 p-3 font-medium hover:text-[#AE4AD9] cursor-pointer">{item.name}</div>;
                })}
              </div>
            </div>
          </div>
          <div className="p-4 border-t-[1px] mt-10"></div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Category;
