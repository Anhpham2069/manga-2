import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faLock,
  faGift,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ onItemClick, activeItem = 1, isDarkMode }) => {
  const menuItems = [
    { key: 1, label: "Thông tin tài khoản", icon: faCircleUser },
    { key: 2, label: "Đổi mật khẩu", icon: faLock },
    { key: 3, label: "Đổi thẻ quà tặng", icon: faGift },
  ];

  return (
    <div className="laptop:w-[260px] flex-shrink-0">
      <div
        className={`rounded-2xl p-3 shadow-sm transition-colors duration-300 ${isDarkMode ? "bg-[#1e293b]" : "bg-white"
          }`}
      >
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onItemClick(item.key)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${activeItem === item.key
                  ? isDarkMode
                    ? "bg-blue-600/20 text-blue-400"
                    : "bg-blue-50 text-blue-600"
                  : isDarkMode
                    ? "text-gray-400 hover:bg-[#0f172a] hover:text-gray-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
            >
              <FontAwesomeIcon icon={item.icon} className="w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;