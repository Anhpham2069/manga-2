import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../components/layout/DarkModeSlice";


const History = () => {

  const isDarkModeEnable = useSelector(selectDarkMode);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Get history from Local Storage
    const getHistory = () => {  
      const currentTime = new Date().getTime();
      const existingHistory = localStorage.getItem("historyChapter");
      console.log(existingHistory)
      if (existingHistory) {
        let history = JSON.parse(existingHistory);
        // Filter out expired data
        history = history.filter(item => new Date(item.expirationDate).getTime() );
        history.sort((a, b) => b.timestamp - a.timestamp);
        setHistory(history);
      }
    };
    getHistory();
  }, []);
  
console.log(history)
  return (
    <div>
    <NavBar />
    <div className="p-5 bg-bg_light">
      <h2 className="font-bold text-3xl border-b-2 bg-white p-5 text-primary-color">
       Lịch sử
      </h2>
      <div className="p-5 bg-white flex flex-col gap-2">
        {history?.map((item, index) => {
          const timeAgo = formatDistanceToNow(new Date(item.expirationDate), {
            addSuffix: true,
            locale: vi,
          });
          const trimmedTimeAgo = timeAgo.replace(/^khoảng\s/, "");
          return (
            <div className="flex w-full p-2 justify-between items-center relative border-b-2">
              <div className="flex  gap-5 h-full w-full">
                <div className="relative h-full flex">
                  <Link to={`/detail/${item.slug}`}>
                    <img
                  
                      src={item.story?.seoOnPage?.seoSchema?.image}
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
                    {item.story.item?.name}
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
                              {cate?.name}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div>
                    <p className="font-medium">Đã đọc <span className="text-gray-400 italic">: {trimmedTimeAgo}</span>  </p>
                    <p className="font-medium text-gray-400 italic"> Đọc tiếp chapter:  <span cla>{item.currentChapter}</span> </p>
                   
                  </div>
                </div>
                {/* <button
                  className="text-4xl text-red-500 hover:text-red-700 flex-1 flex justify-end items-center"
                >
                  <DeleteFilled />
                </button> */}
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

export default History;

// <li key={index}>
//   {/* Here you can display whatever information you want from the history item */}
//   <Link to={`/detail/${item.slug}`}>Truyện: {item.slug}</Link> -{" "}
//   {new Date(item.timestamp).toLocaleString()}
// </li>