import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faSun,
  faMoon,
  faBell,
  faRightFromBracket,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  selectDarkMode,
  toggleDarkMode,
} from "../../components/layout/DarkModeSlice";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "../../services/apiLoginRequest";
import { createAxios } from "../../createInstance";
import { logoutSuccess } from "../../redux/slice/authSlice";

const HeaderAdmin = () => {
  const isDarkModeEnable = useSelector(selectDarkMode);
  const user = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessToken = user?.accessToken;
  const id = user?._id;

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const handleLogout = () => {
    logOut(dispatch, id, navigate, accessToken);
  };

  // Lấy chữ cái đầu của username
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "A";
  };

  return (
    <div
      className={`rounded-xl shadow-sm px-4 lg:px-6 py-3 flex justify-between items-center transition-all duration-300 ${isDarkModeEnable
        ? "bg-[#1e293b] border border-[#334155]"
        : "bg-white border border-gray-100"
        }`}
    >
      {/* Left — Search */}
      <div className="relative flex-1 lg:flex-none">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className={`absolute top-1/2 -translate-y-1/2 left-3 ${isDarkModeEnable ? "text-gray-400" : "text-gray-400"
            }`}
        />
        <input
          className={`pl-10 pr-4 py-2.5 rounded-lg text-sm font-medium w-full lg:w-72 outline-none transition-all duration-300 ${isDarkModeEnable
            ? "bg-[#0f172a] text-gray-200 border border-[#334155] placeholder-gray-500 focus:border-blue-500"
            : "bg-gray-50 text-gray-700 border border-gray-200 placeholder-gray-400 focus:border-blue-400"
            }`}
          placeholder="Tìm kiếm..."
        />
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2 lg:gap-3 ml-3">
        {/* Home link */}
        <Link to="/">
          <button
            className={`w-9 h-9 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${isDarkModeEnable
              ? "bg-[#0f172a] text-gray-400 hover:text-blue-400 hover:bg-[#1e3a5f]"
              : "bg-gray-50 text-gray-500 hover:text-blue-500 hover:bg-blue-50"
              }`}
            title="Về trang chủ"
          >
            <FontAwesomeIcon icon={faHome} />
          </button>
        </Link>

        {/* Dark mode toggle */}
        <button
          onClick={handleToggleDarkMode}
          className={`w-9 h-9 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${isDarkModeEnable
            ? "bg-[#0f172a] text-yellow-400 hover:bg-[#1e3a5f]"
            : "bg-gray-50 text-amber-500 hover:bg-amber-50"
            }`}
          title={isDarkModeEnable ? "Chế độ sáng" : "Chế độ tối"}
        >
          <FontAwesomeIcon icon={isDarkModeEnable ? faMoon : faSun} />
        </button>

        {/* Notification bell */}
        <button
          className={`hidden lg:flex w-10 h-10 rounded-lg items-center justify-center relative transition-all duration-200 ${isDarkModeEnable
            ? "bg-[#0f172a] text-gray-400 hover:text-blue-400 hover:bg-[#1e3a5f]"
            : "bg-gray-50 text-gray-500 hover:text-blue-500 hover:bg-blue-50"
            }`}
        >
          <FontAwesomeIcon icon={faBell} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Divider */}
        <div
          className={`hidden lg:block w-px h-8 ${isDarkModeEnable ? "bg-[#334155]" : "bg-gray-200"
            }`}
        ></div>

        {/* User info */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="text-right">
            <p
              className={`text-sm font-semibold leading-tight ${isDarkModeEnable ? "text-gray-200" : "text-gray-700"
                }`}
            >
              {user?.username || "Admin"}
            </p>
            <p
              className={`text-xs ${isDarkModeEnable ? "text-gray-500" : "text-gray-400"
                }`}
            >
              Quản trị viên
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            {getInitial(user?.username)}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`hidden lg:flex w-10 h-10 rounded-lg items-center justify-center transition-all duration-200 ${isDarkModeEnable
            ? "bg-[#0f172a] text-gray-400 hover:text-red-400 hover:bg-red-900/20"
            : "bg-gray-50 text-gray-500 hover:text-red-500 hover:bg-red-50"
            }`}
          title="Đăng xuất"
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </div>
    </div>
  );
};

export default HeaderAdmin;
