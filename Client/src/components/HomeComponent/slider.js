import React, { useEffect, useState, useRef } from "react";
import { Carousel } from "antd";
import { Link } from "react-router-dom";
import { getStoriesByList } from "../../services/apiStoriesRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const Slider = () => {
  const [storiesData, setStoriesData] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStoriesByList("truyen-moi");
        if (res.data) {
          setStoriesData(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative group">
      {/* Prev Button */}
      <button
        onClick={() => carouselRef.current?.prev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/50 hover:bg-primary-color text-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0 "
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      {/* Next Button */}
      <button
        onClick={() => carouselRef.current?.next()}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/50 hover:bg-primary-color text-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>

      <Carousel autoplay ref={carouselRef} dots={{ className: "custom-dots" }}>
        {storiesData.items?.slice(0, 4).map((item, index) => (
          <Link to={`detail/${item.slug}`} key={item._id}>
            <div className="relative w-full bg-black phone:h-80 tablet:h-[440px]">
              <img
                className="absolute w-full h-full opacity-25 object-cover z-1"
                src={`https://img.otruyenapi.com${storiesData.seoOnPage?.og_image?.[index]}`}
              ></img>
              <div className="text-white flex justify-center p-10 h-full z-20">
                <div className="flex-1 tablet:p-20">
                  <div className="text-xl font-medium">
                    <p>
                      Chương {item.chaptersLatest?.[0]?.chapter_name || ""}
                    </p>
                  </div>
                  <div className="phone:text-sm tablet:text-4xl w-full font-semibold pt-2 pb-10">
                    <p className="z-40">{item.name}</p>
                  </div>
                  <div className="flex flex-wrap">
                    {item?.category?.map((cate, i) => (
                      <div className="cursor-pointer" key={i}>
                        <p
                          className="mr-1 p-1 rounded-md font-medium border-slate-300 border-2 w-fit tablet:text-sm hover:text-blue-400 phone:text-xs"
                        >
                          {cate.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <img
                  className="phone:w-2/5 tablet:w-1/4 h-full object-cover border-white border-[14px] rotate-[12deg] shadow-2xl -translate-x-10"
                  src={`https://img.otruyenapi.com${storiesData.seoOnPage.og_image?.[index]}`}
                ></img>
              </div>
            </div>
          </Link>
        ))}
      </Carousel>
    </div>
  );
};

export default Slider;
