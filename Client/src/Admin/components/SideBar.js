import React, { useState } from "react";
import {
  DashboardOutlined,
  NotificationFilled,
  ProfileFilled,
  ReadOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  CommentOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../../components/layout/DarkModeSlice";
import { Link } from "react-router-dom";

const SideBarAdmin = ({ onItemClick }) => {
  const isDarkModeEnable = useSelector(selectDarkMode);

  const menuItems = [
    { label: "Dashboard", icon: <DashboardOutlined />, key: 1 },
    { label: "Truyện", icon: <ProfileFilled />, key: 2 },
    { label: "Thể loại", icon: <ReadOutlined />, key: 3 },
    { label: "Người dùng", icon: <UserOutlined />, key: 4 },
    { label: "Thông báo", icon: <NotificationFilled />, key: 5 },
    { label: "Bình luận", icon: <CommentOutlined />, key: 7 },
    { label: "Sticker (Meme)", icon: <SmileOutlined />, key: 8 },
    { label: "Báo lỗi", icon: <ExclamationCircleOutlined />, key: 6 },
  ];

  const [active, setActive] = useState(1);

  const handleClick = (index) => {
    setActive(index === active ? null : index);
    onItemClick(index);
  };

  return (
    <div
      className={`h-full transition-all duration-300 ${isDarkModeEnable ? "bg-[#0f172a] text-gray-300" : "bg-white text-gray-600"
        }`}
    >
      {/* Logo */}
      <Link to="/">
        <div
          className={`px-6 py-5 flex items-center gap-3 border-b transition-all duration-300 ${isDarkModeEnable ? "border-[#1e293b]" : "border-gray-100"
            }`}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-lg"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            M
          </div>
          <div>
            <h1
              className={`text-lg font-extrabold leading-tight ${isDarkModeEnable ? "text-white" : "text-gray-800"
                }`}
            >
              Truyện <span className="text-yellow-400">3s</span>
            </h1>
            <p
              className={`text-[10px] font-medium ${isDarkModeEnable ? "text-gray-500" : "text-gray-400"
                }`}
            >
              Admin Panel
            </p>
          </div>
        </div>
      </Link>

      {/* Menu */}
      <div className="p-4 flex flex-col gap-1">
        <p
          className={`text-[11px] font-semibold uppercase tracking-wider px-4 mb-2 ${isDarkModeEnable ? "text-gray-500" : "text-gray-400"
            }`}
        >
          Menu
        </p>
        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => handleClick(item.key)}
            className={`px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 ${active === item.key
              ? isDarkModeEnable
                ? "bg-blue-600/20 text-blue-400"
                : "bg-blue-50 text-blue-600"
              : isDarkModeEnable
                ? "hover:bg-[#1e293b] text-gray-400 hover:text-gray-200"
                : "hover:bg-gray-50 text-gray-600 hover:text-gray-800"
              }`}
          >
            <div className="flex items-center text-sm font-medium">
              <div
                className={`mr-3 text-base ${active === item.key
                  ? isDarkModeEnable
                    ? "text-blue-400"
                    : "text-blue-500"
                  : ""
                  }`}
              >
                {item.icon}
              </div>
              <span>{item.label}</span>
              {active === item.key && (
                <div
                  className={`ml-auto w-1.5 h-1.5 rounded-full ${isDarkModeEnable ? "bg-blue-400" : "bg-blue-500"
                    }`}
                ></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBarAdmin;
