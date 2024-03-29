import React, { useState } from "react";
import HeaderAdmin from "./components/header";
import SideBarAdmin from "./components/SideBar";
import FooterAdmin from "./components/footer";
import ContentAdmin from "./components/contentAdmin";

const AdminLayout = () => {
  const [selectedItem, setSelectedItem] = useState(1);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };
  return (
    <div>
      <div className="flex justify-between w-full">
        <div className="w-[20%] text-3xl font-semibold ">
          <SideBarAdmin onItemClick={handleItemClick} />
        </div>
        <div className="flex flex-col flex-1 bg-bg_light">
          <div className="p-5">
            <HeaderAdmin />
          </div>
          <div className="p-5 h-full">
            <ContentAdmin selectedItem={selectedItem} />
          </div>
          {/* <ContentAdmin /> */}
        </div>
      </div>
      {/* <FooterAdmin /> */}
    </div>
  );
};

export default AdminLayout;
