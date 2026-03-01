import React, { useState } from "react";
import NavBar from "../layout/Navbar";
import Footer from "../layout/footer";
import Sidebar from "./Sidebar";
import Content from "./ContentCpn";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../layout/DarkModeSlice";

const UserComponent = () => {
  const [selectedItem, setSelectedItem] = useState(1);
  const isDarkModeEnable = useSelector(selectDarkMode);
  const user = useSelector((state) => state.auth.login.currentUser);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  // Lấy chữ cái đầu
  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "A");

  // Tính ngày tham gia
  const getMemberSince = () => {
    if (!user?.createdAt) return "N/A";
    return new Date(user.createdAt).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkModeEnable ? "bg-[#0f172a]" : "bg-gray-50"
        }`}
    >
      <NavBar />

      <div className="max-w-[90%] mx-auto mt-8 mb-12">
        {/* Profile Header Card */}
        <div
          className={`rounded-2xl overflow-hidden shadow-sm mb-6 transition-colors duration-300 ${isDarkModeEnable ? "bg-[#1e293b]" : "bg-white"
            }`}
        >
          {/* Banner */}
          <div
            className="h-36 relative"
            style={{
              background:
                "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-6 relative">
            {/* Avatar */}
            <div className="absolute -top-14 left-8">
              <div
                className="w-28 h-28 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white"
                style={{
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
                }}
              >
                {getInitial(user?.username)}
              </div>
            </div>

            <div className="pt-20 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1
                  className={`text-2xl font-bold ${isDarkModeEnable ? "text-white" : "text-gray-800"
                    }`}
                >
                  {user?.username || "Guest"}
                </h1>
                <p
                  className={`text-sm mt-1 ${isDarkModeEnable ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  {user?.email}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {user?.admin && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-600">
                    Quản trị viên
                  </span>
                )}
                {user?.googleId && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-600">
                    Google
                  </span>
                )}
                <span
                  className={`text-xs ${isDarkModeEnable ? "text-gray-500" : "text-gray-400"
                    }`}
                >
                  Tham gia: {getMemberSince()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col laptop:flex-row gap-6">
          <Sidebar
            onItemClick={handleItemClick}
            activeItem={selectedItem}
            isDarkMode={isDarkModeEnable}
          />
          <div className="flex-1">
            <div
              className={`rounded-2xl p-6 shadow-sm transition-colors duration-300 ${isDarkModeEnable ? "bg-[#1e293b]" : "bg-white"
                }`}
            >
              <Content selectedItem={selectedItem} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserComponent;