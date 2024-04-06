import React, { useState, useEffect } from "react";
import { CaretDownOutlined } from "@ant-design/icons";
import { Popover, Modal, Drawer } from "antd";
import { Link, NavLink, useNavigate } from "react-router-dom";
// import {faSun,} from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faUser,
  faSun,
  faMoon,
  faUserPlus,
  faBars,
  faRightFromBracket,
  faClockRotateLeft,
  faBookmark,
  faCircleUser,
  faSpinner,
  faClose,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";
import "../HomeComponent/style.css";
import TooltipComponent from "../components/tooltip";
import { useSelector, useDispatch } from "react-redux";
import { selectDarkMode, toggleDarkMode } from "../layout/DarkModeSlice";
import { selectSearchTerm } from "../../redux/slice/searchSlice";
import axios from "axios";
import { logOut } from "../../services/apiLoginRequest";
import { createAxios } from "../../createInstance";
import { logoutSuccess } from "../../redux/slice/authSlice";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()


  const searchTerm = useSelector(selectSearchTerm);
  const isDarkModeEnable = useSelector(selectDarkMode);
  const user = useSelector((state) => state.auth.login.currentUser);

  
  const accessToken = user?.accessToken
  const id = user?._id

  
  console.log(user);

  // const [isOpen,setIsOpen] = useState(false)
  const [openCategory, setOpenCategory] = useState(false);
  const [openRating, setOpenRating] = useState(false);
  const [darkMode, setDarkmode] = useState(false);
  // const [isOpen,setIsOpen] = useState(false)
  const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
  const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("left");


  const [genres, setGenres] = useState();
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [resultsMobile, setResultsMobile] = useState(false);

  // Thêm hàm để xử lý khi input bị focus và blur
  const handleInputFocus = () => {
    setShowResults(true);
  };
  const handleInputBlur = () => {
    setShowResults(false);
  };
  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };

  // Thêm useEffect để gọi API mỗi khi từ khóa tìm kiếm thay đổi
  useEffect(() => {
    const fetchData = async () => {
      if (keyword.trim() !== "") {
        setIsLoading(true);
        try {
          const response = await axios.get(
            "https://otruyenapi.com/v1/api/tim-kiem",
            {
              params: {
                keyword,
              },
            }
          );
          setSearchResults(response.data.data);
          setResultsMobile(response.data.data)
        } catch (error) {
          console.error("Error fetching search results:", error);
          setError(
            "An error occurred while searching. Please try again later."
          );
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
        setResultsMobile([]) // Nếu từ khóa tìm kiếm là rỗng, đặt kết quả tìm kiếm thành rỗng
      }
    };

    fetchData();
  }, [keyword]);
  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://otruyenapi.com/v1/api/tim-kiem",
        {
          params: {
            keyword,
          },
        }
      );

      setSearchResults(response.data.data); 
      setResultsMobile(response.data.data)
      // Assuming data is in the response body
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("An error occurred while searching. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearInput = () => {
    setKeyword("");
    setSearchResults([]);
    setResultsMobile()
    setShowResults(true);
  };

  // genres
  useEffect(() => {
    const fetchDataGenres = async () => {
      const res = await axios.get(`https://otruyenapi.com/v1/api/the-loai`);
      // console.log(res)
      if (res.data) {
        setGenres(res.data.data);
      }
    };
    fetchDataGenres();
  }, []);
  // dark mode
  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const handleOpenChange = (newOpen) => {
    setOpenCategory(newOpen);
  };
  const handleOpenChangeRating = (newOpen) => {
    setOpenRating(newOpen);
  };

  // open drawer
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onChange = (e) => {
    setPlacement(e.target.value);
  };
  // logout
let axiosJWT = createAxios(user,dispatch,logoutSuccess)

const handleLogout = () =>{
  logOut(dispatch,id,navigate, accessToken);
}

  return (
    <>
      <div
        className={`${
          isDarkModeEnable ? "bg-[#3A64C2]" : "bg-regal-blue"
        }  w-full h-16 text-white  flex items-center `}
      >
        <div className="px-14 flex items-center w-full max-lg:justify-between">
          <div className="lg:hidden">
            <FontAwesomeIcon icon={faBars} onClick={showDrawer} />
          </div>
          <div className="m-auto">
            <NavLink to={"/"}>
              <img src="https://manga.io.vn/uploads/images/logo.png"></img>
            </NavLink>
          </div>
          <div className="">
            <Drawer
              title="Đọc truyện 5s fake"
              placement={placement}
              closable={false}
              onClose={onClose}
              open={open}
              key={placement}
            >
              <div className="relative pb-5">
              <form onSubmit={handleSubmit}>
                <div className=" relative">
                  {isLoading ? (
                    <button className="absolute text-black top-4 left-2">
                      <FontAwesomeIcon
                        color="grey"
                        size="lg"
                        icon={faSpinner}
                      />
                    </button>
                  ) : (
                    <Link to={`/search/${keyword}`}>
                      <button
                        type="submit"
                        className="absolute text-black top-4 left-2"
                      >
                        <FontAwesomeIcon
                          color="grey"
                          size="lg"
                          icon={faMagnifyingGlass}
                        />
                      </button>
                    </Link>
                  )}

                  <input
                    className="w-full h-12 rounded-full outline-none text-base font-bold text-black bg-[#E6F4FF] pl-9"
                    type="text"
                    id="keyword"
                    name="keyword"
                    value={keyword}
                    onChange={handleInputChange}
                    placeholder="Tìm truyện..."
                    required
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  {keyword && ( // Hiển thị nút "X" chỉ khi ô input không trống
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 py-2  text-black rounded-r flex items-center justify-center"
                      onClick={clearInput} // Sử dụng sự kiện onClick để xóa nội dung ô input
                    >
                      <FontAwesomeIcon color="grey" size="lg" icon={faClose} />
                    </button>
                  )}
                </div>
              </form>
              {error && <p className="error-message">{error}</p>}
              {showResults && searchResults?.items?.length > 0 && (
                <div className=" absolute z-10 top-full left-0 w-full mt-1 bg-white border border-gray-300 shadow-lg">
                  {searchResults.items?.slice(0,10).map((rs, index) => {
                    return (
                      <Link to={`/detail/${rs.slug}`} key={rs._id}>
                        <div className="flex h-20 w-full p-2 hover:bg-[#F1F1F2] hover:border-r-4 border-indigo-500">
                          <img
                            className="h-full"
                            src={`https://img.otruyenapi.com/uploads/${searchResults.seoOnPage.og_image?.[index]}`}
                            alt="anh"
                          />
                          <p
                            className="flex-1 text-black font-bold px-4 py-2 cursor-pointer "
                            
                          >
                            {rs.name}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
              </div>
              <ul className="flex flex-col gap-6 text-base font-bold pb-4">
                <Popover
                  content={<TooltipComponent sx />}
                  trigger="click"
                  placement="bottomLeft"
                  open={openCategory}
                  onOpenChange={handleOpenChange}
                >
                  <li className="border-b-[1px] border-gray-200 pb-2">
                    Thể Loại <CaretDownOutlined />
                  </li>
                </Popover>
                <Popover
                  content={<TooltipComponent />}
                  placement="bottomLeft"
                  trigger="click"
                  open={openRating}
                  onOpenChange={handleOpenChangeRating}
                >
                  <li className="border-b-[1px] border-gray-200 pb-2">
                    Xếp hạng <CaretDownOutlined />
                  </li>
                </Popover>
                <Link to={"/filter"}>
                  <li className="border-b-[1px] border-gray-200 pb-2">
                    Tìm kiếm nâng cao
                  </li>
                </Link>
                <li className="border-b-[1px] border-gray-200 pb-2">
                  Theo dõi
                </li>
                <li className="border-b-[1px] border-gray-200 pb-2">Lịch sử</li>
              </ul>
              
              <div className="flex justify-center items-center h-full">
                <img src="https://doctruyen5s.top/uploads/images/logo.png"></img>
              </div>
            </Drawer>
          </div>
          <div className=" phone:hidden lg:flex items-center text-text-color flex-1 font-bold text-[15px]">
            <div className=" pl-12 flex-row hover:text-white">
              <Popover
                content={<TooltipComponent sx />}
                trigger="click"
                placement="bottomLeft"
                open={openCategory}
                onOpenChange={handleOpenChange}
              >
                <div>
                  <p className="text flex">
                    Thể loại{" "}
                    <span className="mt-0">
                      <CaretDownOutlined />
                    </span>
                  </p>
                </div>
              </Popover>
            </div>
            <Popover
              content={<TooltipComponent />}
              placement="bottomLeft"
              trigger="click"
              open={openRating}
              onOpenChange={handleOpenChangeRating}
            >
              <div className="px-7 flex hover:text-white cursor-pointer">
                <p className="text">
                  Xếp hạng{" "}
                  <span>
                    <CaretDownOutlined />
                  </span>
                </p>
              </div>
            </Popover>
            <Link to={"/filter"}>
              <div className="hover:text-white cursor-pointer">
                <p className="text"> Tìm kiếm nâng cao</p>
              </div>
            </Link>
            <Link to={"/contact"}>
              <div className="hover:text-white cursor-pointer px-7">
                <p className="text"> Liên hệ</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center ">
            <div
              className="cursor-pointer phone:hidden lg:block"
              onClick={handleToggleDarkMode}
            >
              {isDarkModeEnable ? (
                <FontAwesomeIcon icon={faMoon} color="grey" size="xl" />
              ) : (
                <FontAwesomeIcon icon={faSun} size="xl" />
              )}
            </div>
            {/* search */}
            <div className="relative">
              <form onSubmit={handleSubmit}>
                <div className="phone:hidden lg:block relative mx-4">
                  {isLoading ? (
                    <button className="absolute text-black top-2 left-2">
                      <FontAwesomeIcon
                        color="grey"
                        size="lg"
                        icon={faSpinner}
                      />
                    </button>
                  ) : (
                    <Link to={`/search/${keyword}`}>
                      <button
                        type="submit"
                        className="absolute text-black top-2 left-2"
                      >
                        <FontAwesomeIcon
                          color="grey"
                          size="lg"
                          icon={faMagnifyingGlass}
                        />
                      </button>
                    </Link>
                  )}

                  <input
                    className="w-64 h-9 rounded-full outline-none text-sm text-black bg-[#F5F8FA] pl-9"
                    type="text"
                    id="keyword"
                    name="keyword"
                    value={keyword}
                    onChange={handleInputChange}
                    placeholder="Tìm truyện..."
                    required
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  {keyword && ( // Hiển thị nút "X" chỉ khi ô input không trống
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 py-2  text-black rounded-r flex items-center justify-center"
                      onClick={clearInput} // Sử dụng sự kiện onClick để xóa nội dung ô input
                    >
                      <FontAwesomeIcon color="grey" size="lg" icon={faClose} />
                    </button>
                  )}
                </div>
              </form>
              {error && <p className="error-message">{error}</p>}
              {/* {searchResults.length === 0 && !isLoading && showResults && (
                <div className="absolute z-10 top-full left-0 w-full mt-1 bg-white border border-gray-300 shadow-lg" >
                  Không có kết quả.</div>
                )} */}
              {showResults && searchResults?.items?.length > 0 && (
                <div className=" absolute z-50 top-full left-0 w-full mt-1 bg-white border border-gray-300 shadow-lg">
                  {searchResults.items?.slice(0,10).map((rs, index) => {
                    return (
                      <Link to={`/detail/${rs.slug}`} key={rs._id}>
                        <div className="flex h-20 w-full p-2 hover:bg-[#F1F1F2] hover:border-r-4 border-indigo-500">
                          <img
                            className="h-full"
                            src={`https://img.otruyenapi.com//uploads/${searchResults.seoOnPage.og_image?.[index]}`}
                            alt="anh"
                          />
                          <p
                            className="flex-1 text-black font-bold px-4 py-2 cursor-pointer "
                            
                          >
                            {rs.name}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* <Popover content={<SearchResultItem result={searchResults}/>}> */}

              {/* <div className='phone:hidden lg:block relative mx-4'>
                  <button 
                  // onClick={handleSearch} 
                  className='absolute text-black top-2 left-2'><FontAwesomeIcon color='grey' size='lg' icon={faMagnifyingGlass} /></button>
                 <Popover
                //   content={ searchResult?.map(result => (
                //     <SearchResultItem key={result.id} result={result} />
                // ))}
                 >
                    <input className='w-64 h-9 rounded-full outline-none text-sm text-black bg-[#F5F8FA] pl-9'
                      placeholder='Tìm truyện...'
                      type="text" 
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)} 
                    />
                 </Popover>
                </div> */}
            </div>

            {/* login */}
            <Popover
              placement="bottomLeft"
              trigger="click"
              content={
                <div className=" text-emerald-950 font-bold flex  flex-col justify-start items-start text-base">
                  {user ? (
                    <>
                        <Link to={'/user'}>
                          <button className="text-red-950">Hi: {user?.username}</button>
                        </Link>
                        <Link to={'/user'}>  
                        <button
                          className="text2 mt-3 hover:text-gray-500"
                        >
                          {" "}
                          <FontAwesomeIcon icon={faCircleUser} /> Tài khoản
                        </button>
                        </Link>
                        <Link to={"/favorites"}>
                          <button
                            className="text2 mt-3 hover:text-gray-500"
                          >
                            <FontAwesomeIcon icon={faBookmark} /> Theo dõi
                          </button>
                        </Link>
                      <Link to={'/history'}>
                        <button
                          className="text2 mt-3 hover:text-gray-500"
                        >
                          <FontAwesomeIcon icon={faClockRotateLeft} /> Lịch sử
                        </button>
                      </Link>
                      {user.admin && 
                        <Link to={'/admin'}>
                          <button
                            className="text2 mt-3 hover:text-gray-500"
                          >
                            <FontAwesomeIcon icon={faFaceSmile} /> Admin
                          </button>
                        </Link>
                      }
                      <button
                        className="text2 mt-3 hover:text-gray-500"
                        onClick={handleLogout}
                      >
                        <FontAwesomeIcon icon={faRightFromBracket} /> Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="text2 hover:text-gray-500"
                      >
                      <Link to={'/login'}>
                        <FontAwesomeIcon icon={faUser} /> Đăng nhập
                      </Link>
                      </button>
                      <button
                        className="text2 mt-3 hover:text-gray-500"
                      
                      >
                        <Link to={'/register'}>
                          <FontAwesomeIcon icon={faUserPlus} /> Đăng kí
                        </Link>
                      </button>
                    </>
                  )}
                </div>
              }
            >
              {user? 
                <div className="flex justify-center items-center bg-orange-400 shadow-lg  px-3 rounded-full">
                  <p className=" phone:text-sm font-bold text-white tablet:text-lg  p-1 cursor-pointer hover:text-slate-200">
A
                  </p>
                </div>
              :
              
              <span className="cursor-pointer border-solid border-2 rounded-full w-10 h-10 flex items-center justify-center bg-white">
                <FontAwesomeIcon
                  icon={faUser}
                  size="lg"
                  className="text-regal-blue bg-re"
                />
              </span>
              }
            </Popover>

           
          </div>
        </div>
      </div>
      <div className="bg-[#5383EE] w-full h-9 text-center flex justify-center items-center text-white">
        <p>Click quảng cáo để ủng hộ mình các bạn nhé :3</p>
      </div>
    </>
  );
};

export default NavBar;
