import React, { useEffect } from "react";
import ChartComponent from "./ChartComponest";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAllStories } from "../../../services/apiStoriesRequest";
import {
  faBook,
  faBookOpenReader,
  faNewspaper,
  faUserSecret,
} from "@fortawesome/free-solid-svg-icons";

const Dasbroad = () => {
  const userList = useSelector((state) => state.user.users?.allUsers);
  const storiesList = useSelector((state) => state.story.storys?.allstorys);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllStories(dispatch);
  }, [dispatch]);

  return (
    <div>
      <div className="bg-white rounded-md w-full p-10 tablet:flex justify-between gap-5 text-sm">
        {/* Tổng truyện */}
        <div className="shadow-md w-[30%] p-2 py-3 gap-5 flex justify-around items-center bg-red-400 text-white font-bold rounded-md">
          <FontAwesomeIcon icon={faBook} size="xl" />
          <div className="flex-1 h-full">
            <p className="text-2xl font-extrabold">
              {storiesList?.data?.params?.pagination?.totalItems || 0}
            </p>
            <p className="font-medium">Số lượng truyện</p>
          </div>
        </div>

        {/* Truyện hôm nay */}
        <div className="shadow-md w-[30%] p-2 py-3 gap-5 flex justify-around items-center bg-yellow-400 text-white font-bold rounded-md">
          <FontAwesomeIcon icon={faNewspaper} size="xl" />
          <div className="flex-1 h-full">
            <p className="text-2xl font-extrabold">
              {storiesList?.data?.params?.itemsUpdateInDay || 0}
            </p>
            <p className="font-medium">Truyện cập nhật hôm nay</p>
          </div>
        </div>

        {/* Users */}
        <div className="shadow-md w-[30%] p-2 py-3 gap-5 flex justify-around items-center bg-blue-400 text-white font-bold rounded-md">
          <FontAwesomeIcon icon={faUserSecret} size="xl" />
          <div className="flex-1 h-full">
            <p className="text-2xl font-extrabold">{userList?.length || 0}</p>
            <p className="font-medium">Người dùng</p>
          </div>
        </div>

        {/* Lượt đọc */}
        <div className="shadow-md w-[30%] p-2 py-3 gap-5 flex justify-around items-center bg-green-400 text-white font-bold rounded-md">
          <FontAwesomeIcon icon={faBookOpenReader} size="xl" />
          <div className="flex-1 h-full">
            <p className="text-2xl font-extrabold">50</p>
            <p className="font-medium">Lượt đọc truyện</p>
          </div>
        </div>
      </div>

      <div className="flex mt-5">
        <ChartComponent />
      </div>
    </div>
  );
};

export default Dasbroad;
