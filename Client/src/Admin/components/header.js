import React from "react";
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
} from "@fortawesome/free-solid-svg-icons";

import { useSelector, useDispatch } from "react-redux";
import {
  selectDarkMode,
  toggleDarkMode,
} from "../../components/layout/DarkModeSlice";

const HeaderAdmin = () => {
  const isDarkModeEnable = useSelector(selectDarkMode);

  const user = useSelector((state) => state.auth.login.currentUser);

  const dispatch = useDispatch();

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };
  return (
    <div className="p-3  flex justify-between  text-slate-400 items-center">
      <div className="relative h-full">
        <button type="submit" className="absolute text-black top-2 right-2">
          <FontAwesomeIcon color="grey" size="lg" icon={faMagnifyingGlass} />
        </button>
        <input className="text-lg font-bold h-full p-2 rounded-lg" />
      </div>
      <div className="flex gap-5 items-center">
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
        <div className="flex gap-2 items-center">
          <p>Hello,{user?.username}</p>
          <div className="flex justify-center items-center bg-orange-400 shadow-lg  px-3 rounded-full">
            <p className=" phone:text-sm font-bold text-white tablet:text-lg  p-1 cursor-pointer hover:text-slate-200">
              A
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;
