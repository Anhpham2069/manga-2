import React, { useState } from "react";
import HeaderAdmin from "./components/header";
import SideBarAdmin from "./components/SideBar";
import FooterAdmin from "./components/footer";
import ContentAdmin from "./components/contentAdmin";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../components/layout/DarkModeSlice";

const AdminLayout = () => {
  const [selectedItem, setSelectedItem] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDarkModeEnable = useSelector(selectDarkMode);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setSidebarOpen(false);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${isDarkModeEnable ? "bg-[#0f172a]" : "bg-[#f1f5f9]"
        }`}
    >
      <div className="flex w-full min-h-screen">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - hidden on mobile, shown on lg+ */}
        <div
          className={`fixed lg:static top-0 left-0 h-full z-50 w-[240px] min-w-[240px] border-r transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } ${isDarkModeEnable ? "border-[#1e293b]" : "border-gray-200"}`}
        >
          <SideBarAdmin onItemClick={handleItemClick} />
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Mobile header with hamburger */}
          <div className="p-4 flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`lg:hidden w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-[5px] transition-all duration-300 ${isDarkModeEnable
                ? "bg-[#1e293b] hover:bg-[#334155]"
                : "bg-white hover:bg-gray-50 shadow-sm border border-gray-200"
                }`}
            >
              <span
                className={`block h-[2px] w-5 rounded-full transition-all duration-300 ${isDarkModeEnable ? "bg-gray-300" : "bg-gray-600"
                  } ${sidebarOpen ? "rotate-45 translate-y-[7px]" : ""}`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full transition-all duration-300 ${isDarkModeEnable ? "bg-gray-300" : "bg-gray-600"
                  } ${sidebarOpen ? "opacity-0 scale-0" : ""}`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full transition-all duration-300 ${isDarkModeEnable ? "bg-gray-300" : "bg-gray-600"
                  } ${sidebarOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
              />
            </button>
            <div className="flex-1">
              <HeaderAdmin />
            </div>
          </div>
          <div className="p-4 flex-1">
            <ContentAdmin selectedItem={selectedItem} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
