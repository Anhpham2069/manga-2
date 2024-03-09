import React, { useRef, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import NavBar from "../layout/Navbar";
import Footer from "../layout/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {faSun,} from "@fortawesome/free-regular-svg-icons"
import {
  faUser,
  faSignal,
  faEye,
  faHeart,
  faClock,
  faBusinessTime,
  faBook,
  faBookTanakh,
  faBookOpen,
  faArrowRightArrowLeft,
  faStar,
  faCaretRight,
  faCaretLeft,
  faCommentDots,
  faPaperPlane,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import CardStories from "../components/cardStories";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../layout/DarkModeSlice";

import { Data } from "../../services/Data";
import axios from "axios";

const DetailStories = () => {
  const { slug } = useParams();
  console.log(slug);

  const isDarkModeEnable = useSelector(selectDarkMode);
  const [story, setStory] = useState({});

  const [searchQuery, setSearchQuery] = useState("");

  // Function to toggle sorting order

  // Filter the chapters based on the search query
  // const [chapters,setChapters] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://otruyenapi.com/v1/api/truyen-tranh/${slug}`
        );
        if (res.data) {
          setStory(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [slug]);
  console.log(story);

  const filteredChapters = story.item?.chapters[0].server_data?.filter(
    (chap) => {
      return chap.chapter_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    }
  );

  const containerRef = useRef(null);

  const scroll = (scollOffset) => {
    containerRef.current.scrollLeft += scollOffset;
  };

  // time update story
  let timeUpdate = "";
  if (story.seoOnPage?.updated_time) {
    const epochTime = story.seoOnPage.updated_time;
    const dateFromEpoch = new Date(epochTime);
    timeUpdate = formatDistanceToNow(dateFromEpoch, {
      addSuffix: true,
      locale: vi,
    });
  } else {
    // If updated_time is not available, provide a default value or handle it gracefully
    timeUpdate = "N/A";
  }
  console.log(timeUpdate)


  // if (!truyen) {
  //   return <div>Truyện không tồn tại</div>;
  // }
  // const latestChapter = stories.chapters[stories.chapters.length - 1];
  return (
    <div className={`${isDarkModeEnable ? "bg-bg_dark" : "bg-bg_light"}`}>
      <NavBar />
      <div className="relative h-full">
        <div className="w-full h-64 absolute top-0 z-20">
          <img
            className="w-full h-64 object-cover"
            src={`https://img.otruyenapi.com/uploads/comics/${slug}-thumb.jpg`}
            alt="anh"
          />
        </div>
        <div className=" h-fit laptop:w-[90%] m-auto relative z-30 top-32">
          {/* header */}
          <div className=" grid phone:grid-cols-1 phone:gap-0  laptop:grid-cols-5 lg:gap-4">
            <div className="">
              <img
                className=" w-[40%] phone:h-56 phone:m-auto  object-cover laptop:h-96 laptop:w-full"
                src={`https://img.otruyenapi.com/uploads/comics/${slug}-thumb.jpg`}
                alt="anh"
              />
              {/* <div
                className={`${
                  isDarkModeEnable
                    ? "bg-bg_dark_light text-text_darkMode"
                    : "bg-white"
                } flex justify-between p-2 my-5 rounded-md`}
              >
                <span>******</span>
                <p>9.3/10 (12)</p>
              </div> */}
              {/* <Link to={`/detail/${id}/1`}> */}
              <button
                className={`${
                  isDarkModeEnable
                    ? "bg-[#3963C0] text-text_darkMode"
                    : "bg-primary-color text-white "
                }   p-2 mb-5 my-5 w-full rounded-md uppercase`}
              >
                Đọc ngay
              </button>
              {/* </Link> */}
              <aside
                className={`${
                  isDarkModeEnable
                    ? "bg-bg_dark_light text-text_darkMode"
                    : "bg-white"
                }  p-2 grid grid-rows-2 gap-4 text-sm`}
              >
                <div className="flex justify-between">
                  <span>
                    <FontAwesomeIcon icon={faUser} /> Tác giả{" "}
                  </span>
                  <p>{story.seoOnPage?.seoSchema.director}</p>
                </div>
                <div className="flex justify-between">
                  <span>
                    <FontAwesomeIcon icon={faSignal} /> Trạng thái
                  </span>
                  <p>Đang tiến hành</p>
                </div>
                <div className="flex justify-between">
                  <span>
                    <FontAwesomeIcon icon={faEye} /> Lượt xem
                  </span>
                  <p>10.000</p>
                </div>
                <div className="flex justify-between">
                  <span>
                    <FontAwesomeIcon icon={faHeart} /> Theo dõi
                  </span>
                  <p>1000</p>
                </div>
                <div className="flex justify-between">
                  <span>
                    <FontAwesomeIcon icon={faClock} /> Đăng vào
                  </span>
                  <p>{story?.item?.updatedAt?.slice(0, 10)}</p>
                </div>
                <div className='flex justify-between'><span><FontAwesomeIcon icon={faBusinessTime} /> Cập nhật</span><p>{timeUpdate}</p></div>
              </aside>
            </div>
            <div
              className={`${
                isDarkModeEnable
                  ? "bg-bg_dark_light text-text_darkMode"
                  : "bg-white"
              } h-fit phone:mt-4 laptop:mt-0  col-span-4  p-7`}
            >
              <div>
                <header>
                  <p className="font-bold uppercase text-lg">
                    {story.item?.name}
                  </p>
                  <p>tên khác: {story.seoOnPage?.seoSchema.name}</p>
                </header>
                <div className="flex mt-3">
                  {story.item?.category?.map((cate) => {
                    return (
                      <NavLink to={`/category/${cate.slug}`} key={cate.id}>
                        <p
                          className={`${
                            isDarkModeEnable ? "bg-[#252A34]" : "bg-[#EEF3FD]"
                          } border-[1px] rounded-md
                             mr-4 text-primary-color text-sm border-primary-color p-1  hover:bg-primary-color hover:text-white`}
                        >
                          {cate.name}
                        </p>
                      </NavLink>
                    );
                  })}
                </div>
                <div className="text-white w-full flex justify-center mt-5">
                  {/* <Link to={`/detail/${id}/1`}> */}
                  <button
                    className={`${
                      isDarkModeEnable
                        ? "bg-[#719331] hover:bg-[#576D2C] text-text_darkMode"
                        : " bg-[#8BC34A] hover:bg-[#B2D786]"
                    } w-52 rounded-md h-10  `}
                  >
                    {" "}
                    <FontAwesomeIcon icon={faBook} /> Bắt đầu đọc
                  </button>
                  {/* </Link> */}
                  {/* <Link to={`/detail/${id}/${latestChapter.chapter_id}`}> */}
                  <button
                    className={`${
                      isDarkModeEnable
                        ? "bg-[#970DB3] hover:bg-[#701483] text-text_darkMode"
                        : " bg-[#BD10E0] hover:bg-[#D360EA]"
                    } w-52 rounded-md h-10   mx-4`}
                  >
                    {" "}
                    <FontAwesomeIcon icon={faBookTanakh} /> Chương mới nhất
                  </button>
                  {/* </Link> */}
                  <button
                    className={`${
                      isDarkModeEnable
                        ? "bg-[#AA0022] hover:bg-[#7D0B22] text-text_darkMode"
                        : " bg-[#FF3860] hover:bg-[#FF7A95]"
                    } w-52 rounded-md h-10  `}
                  >
                    {" "}
                    <FontAwesomeIcon icon={faHeart} /> Theo Dõi
                  </button>
                </div>
                <div className="mt-3">
                  <p className="font-bold">Giới thiệu</p>
                  {/* <p>Đọc truyện tranh {} tiếng việt. Mới nhất, ảnh đẹp chất lượng cao, nhanh nhất tại DOCTRUYEN5S.TOP</p> */}
                  <p>{story.seoOnPage?.descriptionHead}</p>
                </div>
              </div>
              <div className="mt-14">
                <div className="py-3 font-semibold text-primary-color  flex justify-between items-center border-b-[1px] border-gray-100">
                  <div>
                    <FontAwesomeIcon icon={faBookOpen} /> Danh sách chương
                  </div>

                  {/* <FontAwesomeIcon 
                          className='cursor-pointer' 
                          icon={faArrowRightArrowLeft} 
                          rotation={90} 
                          onClick={toggleSortOrder} 
                      /> */}
                </div>
                {/* danh sach chuong */}
                <div className="w-full ">
                  <input
                    className={`${
                      isDarkModeEnable ? "bg-[#252A34]" : "bg-[#EEF3FD]"
                    } mt-6 w-full border-[1px] h-8 text-sm  border-bd-color outline-none p-3 rounded-sm`}
                    placeholder="Tìm chương..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="pt-4 grid lg:grid-cols-4 gap-4 overflow-y-auto max-h-80">
                    {filteredChapters?.map((chap) => {
                      return (
                        <Link
                          to={`view/${chap.chapter_api_data.split("/").pop()}`}
                          key={chap.chapter_name}
                        >
                          <div
                            className={`${
                              isDarkModeEnable ? "bg-[#252A34]" : "bg-[#EEF3FD]"
                            }  rounded-md border-[1px] border-bd-color transition flex-row justify-start items-center p-4 hover:bg-primary-color hover:text-white`}
                          >
                            <p>Chapter {chap.chapter_name}</p>
                            {/* <p className='text-gray-500 text-sm'>12 giờ trước</p> */}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* recommend */}

        <div
          className={`${
            isDarkModeEnable
              ? "bg-bg_dark_light text-text_darkMode"
              : "bg-white"
          } h-fit mt-40 m-auto laptop:w-[90%] shadow-lg `}
        >
          <div className="py-1 h-12 flex items-center justify-between px-4 text-primary-color border-b-[1px] border-[#F0F0F0] ">
            <button className=" text-lg font-semibold h-4/5  flex items-center justify-center rounded-lg">
              <FontAwesomeIcon icon={faStar} className="mr-2" /> Bạn có thể
              thích
            </button>
            <div>
              <FontAwesomeIcon
                icon={faCaretLeft}
                size="xl"
                className="mr-3 cursor-pointer"
                onClick={() => scroll(-100)}
              />
              <FontAwesomeIcon
                icon={faCaretRight}
                size="xl"
                className="cursor-pointer"
                onClick={() => scroll(+100)}
              />
            </div>
          </div>
          <div
            className="container-trendStrories h-fit relative p-4 flex overflow-x-scroll scroll-none w-full transition-transform duration-300"
            ref={containerRef}
          >
            {Data.map((item) => {
              const timeAgo = formatDistanceToNow(new Date(item.date_added), {
                addSuffix: true,
                locale: vi,
              });
              const trimmedTimeAgo = timeAgo.replace(/^khoảng\s/, "");
              // const newestChapter = layChapterMoiNhat(item);
              if (item.views > 10000) {
                return (
                  <CardStories
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    img={item.image}
                    time={trimmedTimeAgo}
                    views={item.views}
                    saves={item.saves}
                    nomarl
                  />
                );
              }

              return null;
            })}
          </div>
        </div>

        {/* comment */}
        <div
          className={`${
            isDarkModeEnable
              ? "bg-bg_dark_light text-text_darkMode"
              : "bg-white"
          } h-fit mt-10 m-auto laptop:w-[90%] shadow-lg `}
        >
          <div className="py-1 h-12 flex items-center  justify-between px-4 text-lg font-semibold text-primary-color border-b-[1px] border-[#F0F0F0] ">
            <p>
              <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
              <span>Bình luận</span>
            </p>
          </div>

          <div className="h-fit w-full  border-[1px] border-[#F0F0F0] flex flex-col py-5  items-center">
            <div
              className={`${
                isDarkModeEnable
                  ? "bg-bg_dark_light text-text_darkMode"
                  : "bg-[#FFBABA]"
              } text-start w-full p-5  my-5`}
            >
              <p className="">
                Bạn cần<span className="font-bold"> Đăng nhập</span> hoặc{" "}
                <span className="font-bold"> Đăng kí</span> để bình luận
              </p>
            </div>
            <div className="relative w-[90%] flex justify-center mb-5 ">
              <textarea
                className={`${
                  isDarkModeEnable
                    ? "bg-bg_dark_light text-text_darkMode"
                    : "bg-white"
                } h-52 w-full  p-4 border-2 border-[#F0F0F0]  outline-none`}
              ></textarea>
              <FontAwesomeIcon
                icon={faPaperPlane}
                size="xl"
                className="absolute bottom-3 right-5 text-primary-color"
              />
            </div>
            <button className="w-60 h-10 bg-primary-color rounded-md text-white">
              Thêm bình luận
            </button>
          </div>
        </div>

        {/* tag */}
        <div
          className={`${
            isDarkModeEnable
              ? "bg-bg_dark_light text-text_darkMode"
              : "bg-white"
          } h-fit mt-10 m-auto laptop:w-[90%] shadow-lg `}
        >
          <div className="py-1 h-12 flex items-center  justify-between px-4 text-lg font-semibold text-primary-color border-b-[1px] border-[#F0F0F0] ">
            <p>
              <FontAwesomeIcon icon={faTags} className="mr-2" />
              <span>Tags</span>
            </p>
          </div>
          <div className="relative w-[90%] flex justify-center mb-5 p-4 ">
            <a>
              Nettruyen, Truyenqq, Blogtruyen, Manhuavn, Manhwatv, Tiemsachnho,
              Teamlanhlung, Truyentranhaudio, Vlogtruyen, Vcomi, Doctruyen3q,
              Nhattruyen, Truyện tranh, Truyen tranh online, Đọc truyện tranh,
              Truyện tranh hot, Truyện tranh hay, Truyện ngôn tình, mi2manga,
              vcomycs, otakusan, ocumeo, Nhất Đẳng Gia Đinh, , Nhất Đẳng Gia
              Đinh Nettruyen, Nhất Đẳng Gia Đinh Blogtruyen, Nhất Đẳng Gia Đinh
              truyenqq, Nhất Đẳng Gia Đinh, Nhất Đẳng Gia Đinh Nettruyen, Nhất
              Đẳng Gia Đinh Blogtruyen, Nhất Đẳng Gia Đinh Truyenqq,
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DetailStories;
