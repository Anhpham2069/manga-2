import React, { useEffect, useState } from "react";
import { Carousel } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowRightOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

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


  return (
    <Carousel autoplay>
        {storiesData.items?.slice(0, 4).map((item, index) => (
          <div key={item._id} className=" relative   w-full bg-black phone:h-80 tablet:h-[440px]">
              <img className="absolute w-full h-full opacity-25 object-cover z-1" src={`https://img.otruyenapi.com${storiesData.seoOnPage.og_image?.[index]}`}></img>
            <div className=" text-white flex justify-center p-10 h-full z-20 ">
              <div className="flex-1 tablet:p-20">
                <div className="text-xl font-medium"><p>Chương {item.chaptersLatest[0].chapter_name}</p> </div>
                  <div className="phone:text-sm tablet:text-4xl w-full font-semibold  pt-2 pb-10">
                    <Link to={`detail/${item.slug}/view/${item.chaptersLatest[0].chapter_api_data?.split("/").pop()}`}>
                      <p>{item.name}</p>   
                    </Link>
                  </div>
                <div className="flex flex-wrap">
                  {item?.category?.map((cate, index) => {
                    return (
                      <Link to={`/category/${cate.slug}`} key={index}>
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
              <img className="phone:2/5 tablet:w-1/5 h-full border-white border-[14px] " src={`https://img.otruyenapi.com${storiesData.seoOnPage.og_image?.[index]}`}></img>
            </div>
            {/* <button  className="absolute bg-primary-color text-3xl rounded-full font-bold h-1/6 w-[7%] right-5 top-1/2 z-30"><RightOutlined /></button>
            <button className="absolute bg-primary-color text-3xl rounded-full font-bold h-1/6 w-[7%] left-5  top-1/2 z-30"><LeftOutlined /></button> */}
          </div>
        ))}
  </Carousel>
  );
};

export default Slider;
