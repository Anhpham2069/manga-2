import React, { useEffect, useState } from "react";
import { Carousel } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

const Slider = () => {
  const [storiesData, setStoriesData] = useState([]);
  // const [story,setStory] = useState([])
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState("truyen-moi");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://otruyenapi.com/v1/api/danh-sach/${slug}`
        );

        if (res.data) {
          setStoriesData(res.data.data);
        }
      } catch (error) {
        // Xử lý lỗi ở đây, ví dụ:
        console.error("Error fetching data:", error);
        // Có thể hiển thị thông báo lỗi cho người dùng hoặc xử lý theo cách phù hợp khác
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);
  console.log(storiesData);

  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };
  return (
    // <Carousel afterChange={onChange}>
    <>
        {storiesData.items?.slice(0, 1).map((item, index) => (
          <div key={item._id} className=" relative grid grid-cols-5  w-full bg-black phone:h-80 tablet:h-[440px]"
          >
              <img className="absolute w-full h-full opacity-25 object-cover z-10" src={`https://img.otruyenapi.com${storiesData.seoOnPage.og_image?.[index]}`}></img>
            
            <div className=" text-white flex flex-col justify-center p-10 col-span-3 h-2/3 z-20 phone:pt-20">
              <p className="text-xl font-medium"> Chương {item.chaptersLatest[0].chapter_name}</p>
              <div className="phone:text-sm tablet:text-4xl w-full font-semibold  pt-2 pb-10"> <p>{item.name}</p></div>
              <div className="flex flex-wrap">
                {item?.category?.map((cate, index) => {
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
            <div className="col-span-2 w-full h-full flex items-center justify-center overflow-hidden z-20">
              <img className="w-3/4 h-[110%]  border-white border-[14px] rotate-12 " src={`https://img.otruyenapi.com${storiesData.seoOnPage.og_image?.[index]}`}></img>
            </div>
          </div>
        ))}
    </>
    // </Carousel>
  );
};

export default Slider;
