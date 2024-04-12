// FavoriteStories.js
import React, { useEffect, useState } from "react";
import NavBar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectDarkMode } from "../components/layout/DarkModeSlice";
import { DeleteFilled } from "@ant-design/icons";
import {
  getAllFavorites,
  getFavoritesByUser,
  removeFavoritesStory,
} from "../services/apiStoriesRequest";
import { message } from "antd";

const FavoriteStories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isDarkModeEnable = useSelector(selectDarkMode);
  const favorites = useSelector(
    (state) => state.favorite.favorites?.allFavorites
  );
  const user = useSelector((state) => state?.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const userId = user?._id;


// const [fa,setFA] = useState()

//   useEffect(()=>{
//     const fetchData = async () =>{
//       const res = await getFavoritesByUser(accessToken, userId);
//       if(res){
//         setFA(res)
//       }
//     }
//     fetchData()
//   },[])
// console.log(fa)
  const handleDeleteFavorites = (slug) => {
    removeFavoritesStory(accessToken, slug, userId, dispatch);
    message.success("Bỏ yêu thích");
  };


  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (accessToken) {
      getFavoritesByUser(accessToken, userId, dispatch);
    }
  }, [accessToken, userId]);

  console.log(favorites);

  return (
    <div>
      <NavBar />
      <div className="p-5 bg-bg_light">
        <h2 className="font-bold text-3xl border-b-2 bg-white p-5 text-primary-color">
          Danh sách truyện yêu thích
        </h2>
        <div className="p-5 bg-white flex flex-col gap-2">
          {favorites?.map((item, index) => {
            // const timeAgo = formatDistanceToNow(new Date(item.story.updatedAt), {
            //   addSuffix: true,
            //   locale: vi,
            // });
            // const trimmedTimeAgo = timeAgo.replace(/^khoảng\s/, "");
            return (
              <div className="flex w-full p-2 justify-between items-center relative border-b-2">
                <div className="flex justify-center gap-5 h-full w-full">
                  <div className="relative h-full flex">
                    <Link to={`/detail/${item.slug}`}>
                      <img
                        src={item.story?.seoOnPage.seoSchema.image}
                        alt="anh"
                        className="w-32 tablet:h-36 phone:h-20"
                      />
                    </Link>
                  </div>
                  <div className="flex flex-col gap-5">
                    <p
                      className={`${
                        isDarkModeEnable ? "text-[#8a8282]" : "text-black "
                      } phone:text-sm font-bold tablet:text-3xl`}
                    >
                      {item.story.item.name}
                    </p>
                    <div className="flex flex-wrap ">
                      {item.story.breadCrumb?.map((cate, index) => {
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
                    <div>
                      {/* <p className="font-medium">Đã thêm <span className="text-gray-400 italic">: {trimmedTimeAgo}</span> </p> */}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteFavorites(item.slug)}
                    className="text-4xl text-red-500 hover:text-red-700 flex-1 flex justify-end items-center"
                  >
                    <DeleteFilled />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FavoriteStories;
