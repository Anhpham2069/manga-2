import React, { useState } from "react";
import NavBar from "../layout/Navbar";
import Slider from "./slider";
import ScheduleList from "./schedule-list";
import Featured from "./featured";
import Trending from "./trending";
import Footer from "../layout/footer";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../layout/DarkModeSlice";
import StoryFilterMenu from "./StoryFilterMenu";

const HomeLayout = () => {
  const isDarkModeEnable = useSelector(selectDarkMode);

  const [activeFilter, setActiveFilter] = useState("truyen-moi");
  const [slug, setSlug] = useState("truyen-moi");

  return (
    <div
      className={`${isDarkModeEnable ? "bg-bg_dark" : "bg-bg_light"
        } flex flex-col`}
    >
      <NavBar />
      <div className="max-w-full tablet:max-w-[90%] laptop:max-w-[75%] mx-auto w-full">
        <div className="pt-3 lg:px-14 tablet:px-6">
          <Slider />
          <Trending dark={isDarkModeEnable} />
        </div>

        <div className="pt-4 lg:pt-6 tablet:px-6 lg:px-14">
          <ScheduleList />
        </div>

        {/* ===== FILTER MENU ===== */}
        <div className={`${isDarkModeEnable ? "bg-bg_dark" : "bg-bg_light"
          } lg:px-14 tablet:px-6 mt-5 mb-5`}>
          <StoryFilterMenu
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            setSlug={setSlug}
          />
        </div>

        {/* ===== FEATURED ===== */}
        <Featured dark={isDarkModeEnable} slug={slug} />
      </div>
      <Footer />
    </div>
  );
};

export default HomeLayout;
