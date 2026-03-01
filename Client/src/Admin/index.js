import React, { useState } from "react";
import HeaderAdmin from "./components/header";
import SideBarAdmin from "./components/SideBar";
import FooterAdmin from "./components/footer";
import ContentAdmin from "./components/contentAdmin";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../components/layout/DarkModeSlice";

const AdminLayout = () => {
  const [selectedItem, setSelectedItem] = useState(1);
  const isDarkModeEnable = useSelector(selectDarkMode);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${isDarkModeEnable ? "bg-[#0f172a]" : "bg-[#f1f5f9]"
        }`}
    >
      <div className="flex w-full min-h-screen">
        {/* Sidebar */}
        <div
          className={`w-[240px] min-w-[240px] border-r transition-all duration-300 ${isDarkModeEnable ? "border-[#1e293b]" : "border-gray-200"
            }`}
        >
          <SideBarAdmin onItemClick={handleItemClick} />
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4">
            <HeaderAdmin />
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
