import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../components/layout/DarkModeSlice";
//cpn
import CardStories from "../components/components/cardStories";
// icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {

  faList,
  faTableCells,
} from "@fortawesome/free-solid-svg-icons";
// layout
import NavBar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import { useEffect } from "react";
import axios from "axios";
import { Skeleton } from "antd";
import { useParams } from "react-router-dom";

const Category = () => {
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
    const fetchDataGenres = async () => {
      const res = await axios.get(`https://otruyenapi.com/v1/api/the-loai`);
      if (res.data) {
        setGenres(res.data.data);
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
  console.log(isCategory);

  const handleCategoryChange = (event) => {
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
      <div
        className={`
                 w-[95%]  mt-6 m-auto
            `}
      >
        <div
          className={`${
            darkMode ? "bg-bg_dark_light text-text_darkMode" : "bg-white"
          } laptop:col-span-1  p-2`}
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
              <select
                className="bg-[#E6F4FF] rounded-xl p-2 text-primary-color"
                value={selectedCategory}
                onChange={handleCategoryChange}
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
            </div>
          </div>

          <div
            className={`${
              darkMode ? "bg-bg_dark_light text-text_darkMode" : "bg-white"
            } w-full mt-10  grid  phone:grid-cols-1 phone:gap-2 tablet:grid-cols-3 laptop:grid-cols-${gridCols} desktop:grid-cols-${gridCols} lg:gap-1 place-items-center`}
          >
            {loading && <Skeleton avatar active />}

            {isCategory.items?.map((item, index) => {
              const timeupa = new Date(item.updatedAt);
              const formattedDateTime = timeupa.toISOString().replace('T', ' ').replace('Z', '');
              const trimmedTimeAgo = formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true, locale: vi }).replace(/^khoảng\s/, "");
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
          {/* <div className="p-4 w-full border-t-[1px] mt-10">
      
          </div> */}
        </div>
      </div>
      <Footer />
    </div>
  );
};


export default Category;
