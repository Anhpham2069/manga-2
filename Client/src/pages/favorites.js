// FavoriteStories.js
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
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
  const handleDeleteFavorites = async (slug) => {
    try {
      await removeFavoritesStory(accessToken, slug, userId, dispatch);
      message.success("Bỏ yêu thích");
    } catch {
      message.error("Lỗi server");
    }
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
      <Helmet>
        <title>Truyện yêu thích - DocTruyen5s</title>
        <meta name="description" content="Danh sách truyện yêu thích của bạn tại DocTruyen5s. Theo dõi và đọc truyện tranh bạn yêu thích." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <NavBar />

      <div className="p-5 bg-bg_light min-h-screen">
        <h2 className="font-bold text-3xl border-b-2 bg-white p-5 text-primary-color rounded-md shadow-sm">
          Danh sách truyện yêu thích
        </h2>

        <div className="mt-5 grid gap-4">
          {favorites?.length === 0 && (
            <p className="text-center text-gray-500 py-10">
              Bạn chưa có truyện yêu thích nào 📚
            </p>
          )}

          {favorites?.map((item) => (
            <div
              key={item._id}
              className={`flex gap-4 p-4 rounded-xl shadow-md transition hover:shadow-lg ${isDarkModeEnable ? "bg-bg_dark_light" : "bg-white"
                }`}
            >
              {/* Ảnh */}
              <Link to={`/detail/${item.slug}`} className="shrink-0">
                <img
                  src={item.story?.seoOnPage?.seoSchema?.image}
                  alt="story"
                  className="w-24 h-32 object-cover rounded-lg"
                />
              </Link>

              {/* Thông tin */}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <Link to={`/detail/${item.slug}`}>
                    <h3 className="font-bold text-lg hover:text-primary-color transition">
                      {item.story?.item?.name}
                    </h3>
                  </Link>

                  {/* Thể loại */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.story?.breadCrumb?.slice(1).map((cate) => (
                      <Link key={cate.slug} to={`/category/${cate.slug}`}>
                        <span className="text-xs px-2 py-1 border rounded-full hover:bg-primary-color hover:text-white transition">
                          {cate.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Action */}
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-gray-400 italic">
                    Đã thêm vào yêu thích
                  </span>

                  <button
                    onClick={() => handleDeleteFavorites(item.slug)}
                    className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    <DeleteFilled />
                    Bỏ thích
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>

  );
};

export default FavoriteStories;
