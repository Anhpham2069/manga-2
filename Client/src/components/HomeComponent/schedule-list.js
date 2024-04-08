import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../layout/DarkModeSlice";
import { Link } from "react-router-dom";
import { getStoriesByList } from "../../services/apiStoriesRequest";

const ScheduleList = () => {
  const [storiesData, setStoriesData] = useState([]);
  const isDarkModeEnable = useSelector(selectDarkMode);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("vi-VN");
  // sate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStoriesByList("truyen-moi")
        if (res.data) {
          setStoriesData(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
      }
    };
    fetchData();
  }, []);


  return (
    <div
      className={`${
        isDarkModeEnable ? "bg-bg_dark_light text-text_darkMode" : "bg-white"
      } h-fit p-5  w-full shadow-lg `}
    >
      <div className="phone:flex-row  h-full lg:flex phone:text-xs tablet:text-sm">
        <div
          className={`${
            isDarkModeEnable
              ? "bg-[#3A64C2] text-text_darkMode "
              : "bg-primary-color"
          } text-white lg:w-2/12 phone:w-full phone:text-sm  tablet:text-lg text-center  phone:rounded-3xl lg:rounded-lg'`}
        >
          <p className="phone:p-2  tablet:p-4 font-semibold">
            Lịch Ra truyện Ngày: {formattedDate}{" "}
          </p>
        </div>
        <div className="pl-4">
          {storiesData.items?.slice(0, 10).map((item) => {
            const dateObject = new Date(item.updatedAt);

            const hour = dateObject.getHours();
            const minute = dateObject.getMinutes();
            const second = dateObject.getSeconds();
            return (
              <div
                key={item._id}
                className="flex phone:text-xs laptop:text-base tablet:gap-10 tablet:text-base  py-2"
              >
                <p className="text-green-400">
                  [{hour}:{minute}]
                </p>
                <div className="flex">
                  <Link to={`detail/${item.slug}/view/${item.chaptersLatest[0].chapter_api_data?.split("/").pop()}`}>
                    <p
                      className={`${
                        isDarkModeEnable ? "text-text_darkMode" : "text-[#73868C]"
                      } font-semibold pl-1`}
                    >
                      {item.chaptersLatest[0].filename
                        .slice(0, item.chaptersLatest[0].filename.indexOf("["))
                        .trim()}
                    </p>
                  </Link>
                  <p
                    className={`${
                      isDarkModeEnable ? "text-text_darkMode" : "text-slate-900"
                    } font-semibold pl-1`}
                  >
                    {" "}
                    -{" "}
                    {item.chaptersLatest[0].filename
                      .slice(item.chaptersLatest[0].filename.indexOf("["))
                      .trim()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScheduleList;
