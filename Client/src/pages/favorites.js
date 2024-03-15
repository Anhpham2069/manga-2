// FavoriteStories.js
import React, { useEffect, useState } from "react";
import NavBar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../components/layout/DarkModeSlice";
import { DeleteFilled, DeleteOutlined } from "@ant-design/icons";

const FavoriteStories = () => {
  // Lấy danh sách truyện yêu thích từ Local Storage
  const [favorites, setFavorites] = useState([]);
  const isDarkModeEnable = useSelector(selectDarkMode);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/favorites/get-all"
        );
        const favoriteStoryInfos = response.data.map(
          (favorite) => favorite.storyInfo
        );
        setFavorites(favoriteStoryInfos);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);
  console.log(favorites);
  return (
    <div>
      <NavBar />
      <h2>Danh sách truyện yêu thích</h2>
      <div className=" p-10">
        {favorites.map((item, index) => (
          <div className="flex w-full justify-between relative ">
            <div className="flex gap-5 w-full">
              <div className="relative w-1/6 overflow-hidden">
                <Link to={`/detail/${item.item.slug}`}>
                  <img
                    src={item.seoOnPage.seoSchema.image}
                    alt="anh"
                    className="w-full h-full object-cover transition-all duration-500 transform hover:scale-125"
                  />
                  {/* <div className='bg-black h-1/6 opacity-50 w-full absolute bottom-0 text-white text-sm flex items-center justify-start p-1'>
                                                     <p className='mr-2'><FontAwesomeIcon icon={faBookmark} /> {saves}</p>
                                                     <p><FontAwesomeIcon icon={faEye} />{views} </p>
                                                 </div> */}
                </Link>
              </div>
              <div className="flex flex-col gap-5">

                <p
                  className={`${
                    isDarkModeEnable ? "text-[#CCCCCC]" : "text-black "
                  } font-bold text-3xl mt-3`}
                >
                  {item.item.name}
                </p>
                <div className="flex flex-wrap">
                    {item.breadCrumb?.map((cate, index) => {
                      return (
                        <Link to={`/category/${cate.slug}`}>
                            <div className="cursor-pointer">    
                                <p
                                key={index}
                                className={`mr-1 p-1 rounded-md font-medium border-slate-300 border-2 w-fit  tablet:text-sm hover:text-blue-400 phone:text-xs`}
                                >
                                {cate.name}
                                </p>
                            </div>
                        </Link>
                      );
                    })}
                  </div>
              </div>
              <button className="text-4xl text-red-500 hover:text-red-700 flex-1 flex justify-end items-center"><DeleteFilled /></button>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default FavoriteStories;
