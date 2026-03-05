import React, { useState, useEffect } from "react";
import { CaretDownOutlined } from "@ant-design/icons";
import { Popover, Drawer } from "antd";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import "../HomeComponent/style.css";
import TooltipComponent from "../components/tooltip";
import { useSelector, useDispatch } from "react-redux";
import { selectDarkMode, toggleDarkMode } from "../layout/DarkModeSlice";
import axios from "axios";
import { logOut } from "../../services/apiLoginRequest";
import { createAxios } from "../../createInstance";
import { logoutSuccess } from "../../redux/slice/authSlice";
import AnnouncementBanner from "../components/AnnouncementBanner"; // eslint-disable-line no-unused-vars

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDarkModeEnable = useSelector(selectDarkMode);
  const user = useSelector((state) => state.auth.login.currentUser);

  const accessToken = user?.accessToken;
  const id = user?._id;

  // States
  const [openCategory, setOpenCategory] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readNotiIds, setReadNotiIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("readNotiIds") || "[]"); } catch { return []; }
  });

  const markAsRead = (id) => {
    setReadNotiIds((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      localStorage.setItem("readNotiIds", JSON.stringify(updated));
      return updated;
    });
  };

  const unreadCount = notifications.filter((n) => !readNotiIds.includes(n._id)).length;

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/noti/noti`);
        setNotifications(res.data || []);
      } catch (e) { console.log(e); }
    };
    fetchNotifications();
  }, []);

  // Debounce search
  useEffect(() => {
    if (keyword.trim() === "") {
      setSearchResults([]);
      return;
    }
    const debounceTimer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://otruyenapi.com/v1/api/tim-kiem",
          { params: { keyword } }
        );
        setSearchResults(response.data.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    }, 400);
    return () => clearTimeout(debounceTimer);
  }, [keyword]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (keyword.trim()) {
      setShowResults(false);
      navigate(`/search/${keyword}`);
    }
  };

  const clearInput = () => {
    setKeyword("");
    setSearchResults([]);
  };

  const handleToggleDarkMode = () => dispatch(toggleDarkMode());

  let axiosJWT = createAxios(user, dispatch, logoutSuccess); // eslint-disable-line no-unused-vars
  const handleLogout = () => logOut(dispatch, id, navigate, accessToken);

  // Lấy chữ cái đầu
  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "A");

  // ======= Search Input (dùng chung cho desktop + drawer) =======
  const renderSearchInput = (isMobile) => (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <button
            type="submit"
            className={`absolute top-1/2 -translate-y-1/2 left-3 ${isLoading ? "animate-spin" : ""
              }`}
          >
            <FontAwesomeIcon
              color="grey"
              icon={isLoading ? faSpinner : faMagnifyingGlass}
            />
          </button>
          <input
            className={`rounded-full outline-none text-sm font-medium pl-9 pr-9 ${isMobile
              ? "w-full h-11 bg-gray-100 text-gray-700 placeholder-gray-400"
              : "w-64 h-9 bg-white text-gray-700 placeholder-gray-400"
              }`}
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm truyện..."
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
          {keyword && (
            <button
              type="button"
              className="absolute top-1/2 -translate-y-1/2 right-3"
              onClick={clearInput}
            >
              <FontAwesomeIcon color="grey" icon={faClose} />
            </button>
          )}
        </div>
      </form>
      {/* Search Results Dropdown */}
      {showResults && searchResults?.items?.length > 0 && (
        <div className="absolute z-50 top-full left-0 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-xl overflow-hidden">
          {searchResults.items?.slice(0, 8).map((rs, index) => (
            <Link to={`/detail/${rs.slug}`} key={rs._id}>
              <div className="flex h-16 w-full p-2 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0">
                <img
                  className="h-full rounded object-cover"
                  src={`https://img.otruyenapi.com/uploads/${searchResults.seoOnPage.og_image?.[index]}`}
                  alt={rs.name}
                />
                <p className="flex-1 text-gray-800 font-semibold text-sm px-3 py-1 line-clamp-2">
                  {rs.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  // ======= User Menu Popover Content =======
  const UserMenuContent = () => (
    <div className="flex flex-col gap-1 min-w-[180px] p-1">
      {user ? (
        <>
          <div className="px-3 py-2 border-b border-gray-100 mb-1">
            <p className="font-bold text-gray-800">{user?.username}</p>
            <p className="text-xs text-gray-400">
              {user.admin ? "Quản trị viên" : "Thành viên"}
            </p>
          </div>
          <Link to="/user">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-500 rounded-md transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faCircleUser} className="w-4" /> Tài khoản
            </button>
          </Link>
          <Link to="/favorites">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-500 rounded-md transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faBookmark} className="w-4" /> Theo dõi
            </button>
          </Link>
          <Link to="/history">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-500 rounded-md transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faClockRotateLeft} className="w-4" /> Lịch
              sử
            </button>
          </Link>
          {user.admin && (
            <Link to="/admin">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-500 rounded-md transition-colors flex items-center gap-2">
                <FontAwesomeIcon icon={faFaceSmile} className="w-4" /> Admin
              </button>
            </Link>
          )}
          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="w-4" /> Đăng
              xuất
            </button>
          </div>
        </>
      ) : (
        <>
          <Link to="/login">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-500 rounded-md transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="w-4" /> Đăng nhập
            </button>
          </Link>
          <Link to="/register">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-500 rounded-md transition-colors flex items-center gap-2">
              <FontAwesomeIcon icon={faUserPlus} className="w-4" /> Đăng ký
            </button>
          </Link>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* ======= MAIN NAVBAR ======= */}
      <nav
        className={`w-full h-16 text-white flex items-center transition-colors duration-300 ${isDarkModeEnable ? "bg-[#1e293b]" : "bg-regal-blue"
          }`}
      >
        <div className="max-w-[80%] mx-auto w-full flex items-center justify-between">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-xl p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setDrawerOpen(true)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>

          {/* Logo */}
          <NavLink to="/" className="flex-shrink-0">
            <div className="flex items-center gap-2 transition-transform duration-300 hover:scale-110">
              <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="#facc15" strokeWidth="2.5" fill="none" />
                <path d="M20 8 C28 8 32 14 32 20 C32 26 28 30 22 30 C16 30 14 26 14 22 C14 18 17 16 20 16 C23 16 25 18 25 20 C25 22 23 24 21 24" stroke="#facc15" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
              <h1 className="text-xl font-extrabold text-white tracking-wide">
                DocTruyen<span className="text-yellow-300">5s</span>
              </h1>
            </div>
          </NavLink>

          {/* Desktop Nav Links */}
          <div className="phone:hidden lg:flex items-center gap-0 flex-1 ml-6 font-semibold text-[13px]">
            <Popover
              content={<TooltipComponent sx />}
              trigger="click"
              placement="bottomLeft"
              open={openCategory}
              onOpenChange={setOpenCategory}
            >
              <button className="nav-hover-underline px-3 py-2 hover:bg-white/10 transition-colors flex items-center gap-1">
                Thể loại <CaretDownOutlined className="text-[10px]" />
              </button>
            </Popover>
            <Link to="/ranking">
              <button className="nav-hover-underline px-3 py-2 hover:bg-white/10 transition-colors flex items-center gap-1">
                Xếp hạng <CaretDownOutlined className="text-[10px]" />
              </button>
            </Link>
            <Link to="/filter">
              <button className="nav-hover-underline px-3 py-2 hover:bg-white/10 transition-colors">
                Tìm kiếm nâng cao
              </button>
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <Popover
              placement="bottomRight"
              trigger="click"
              content={
                <div className="w-[300px] max-h-[400px] overflow-y-auto">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h4 className="font-bold text-gray-800 text-sm">Thông báo</h4>
                    <span className="text-xs text-gray-400">{notifications.length} thông báo</span>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">Chưa có thông báo nào</div>
                  ) : (
                    notifications.slice(0, 10).map((noti) => {
                      const isRead = readNotiIds.includes(noti._id);
                      return (
                        <div
                          key={noti._id}
                          onClick={() => markAsRead(noti._id)}
                          className={`px-4 py-3 border-b border-gray-50 transition-colors cursor-pointer ${isRead ? "bg-white" : "bg-blue-50/50 hover:bg-blue-50"
                            }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {!isRead ? (
                              <div className="w-2 h-2 rounded-full bg-primary-color mt-1.5 shrink-0" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              {noti.title && (
                                <p className={`text-sm leading-tight ${isRead ? "font-medium text-gray-400" : "font-semibold text-gray-800"}`}>{noti.title}</p>
                              )}
                              <p className={`text-xs mt-0.5 line-clamp-2 ${isRead ? "text-gray-400" : "text-gray-500"}`}>{noti.message}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-[10px] text-gray-400">
                                  {new Date(noti.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </p>
                                {isRead && <span className="text-[10px] text-green-500 font-medium">Đã đọc</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              }
            >
              <button className="phone:hidden lg:flex w-9 h-9 items-center justify-center rounded-lg hover:bg-white/10 transition-colors relative">
                <FontAwesomeIcon icon={faBell} className="text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </Popover>

            {/* Dark mode toggle */}
            <button
              className="phone:hidden lg:flex w-9 h-9 items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
              onClick={handleToggleDarkMode}
            >
              <FontAwesomeIcon
                icon={isDarkModeEnable ? faMoon : faSun}
                className={isDarkModeEnable ? "text-yellow-300" : "text-white"}
              />
            </button>

            {/* Desktop search */}
            <div className="phone:hidden lg:block">
              {renderSearchInput(false)}
            </div>

            {/* User avatar / menu */}
            <Popover
              placement="bottomRight"
              trigger="click"
              content={<UserMenuContent />}
            >
              {user ? (
                user.avatar ? (
                  <button className="w-9 h-9 rounded-lg overflow-hidden hover:opacity-90 transition-opacity">
                    <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                  </button>
                ) : (
                  <button
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold hover:opacity-90 transition-opacity"
                    style={{
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
                    }}
                  >
                    {getInitial(user?.username)}
                  </button>
                )
              ) : (
                <button className="w-9 h-9 rounded-lg border-2 border-white/30 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
                  <FontAwesomeIcon icon={faUser} className="text-sm" />
                </button>
              )}
            </Popover>
          </div>
        </div>
      </nav>

      {/* ======= SUB BAR ======= */}
      <div
        className={`w-full py-2 text-center text-sm font-medium transition-colors duration-300 ${isDarkModeEnable
          ? "bg-[#334155] text-gray-300"
          : "bg-[#5383EE] text-white"
          }`}
      >
        <p>Click quảng cáo để ủng hộ mình các bạn nhé :3</p>
      </div>

      {/* ======= MOBILE DRAWER ======= */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="#facc15" strokeWidth="2.5" fill="none" />
              <path d="M20 8 C28 8 32 14 32 20 C32 26 28 30 22 30 C16 30 14 26 14 22 C14 18 17 16 20 16 C23 16 25 18 25 20 C25 22 23 24 21 24" stroke="#facc15" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
            <span className="font-bold text-gray-800">
              DocTruyen<span className="text-yellow-500">5s</span>
            </span>
          </div>
        }
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={300}
      >
        {/* Mobile search */}
        <div className="pb-5">
          {renderSearchInput(true)}
        </div>

        {/* Mobile menu */}
        <nav className="flex flex-col gap-1">
          <Popover
            content={<TooltipComponent sx />}
            trigger="click"
            placement="bottomLeft"
            open={openCategory}
            onOpenChange={setOpenCategory}
          >
            <button className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors flex items-center justify-between">
              Thể Loại <CaretDownOutlined />
            </button>
          </Popover>
          <Link to="/ranking" onClick={() => setDrawerOpen(false)}>
            <button className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              Xếp hạng
            </button>
          </Link>
          <Link to="/filter" onClick={() => setDrawerOpen(false)}>
            <button className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              Tìm kiếm nâng cao
            </button>
          </Link>
          <Link to="/favorites" onClick={() => setDrawerOpen(false)}>
            <button className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              Theo dõi
            </button>
          </Link>
          <Link to="/history" onClick={() => setDrawerOpen(false)}>
            <button className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              Lịch sử
            </button>
          </Link>
          <Link to="/contact" onClick={() => setDrawerOpen(false)}>
            <button className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              Liên hệ
            </button>
          </Link>
        </nav>

        {/* Mobile dark mode */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={handleToggleDarkMode}
            className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <FontAwesomeIcon
              icon={isDarkModeEnable ? faMoon : faSun}
              className={isDarkModeEnable ? "text-yellow-500" : "text-amber-500"}
            />
            {isDarkModeEnable ? "Chế độ sáng" : "Chế độ tối"}
          </button>
        </div>
      </Drawer>
    </>
  );
};

export default NavBar;
