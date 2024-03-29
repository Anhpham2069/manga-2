// Dasbroad.js
import React, { useEffect } from "react";
import ChartComponent from "./ChartComponest";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAllStories } from "../../../services/apiStoriesRequest";
import { faBook, faBookOpenReader, faNewspaper, faUserSecret } from "@fortawesome/free-solid-svg-icons";

const Dasbroad = () => {
  const userList = useSelector((state) => state.user.users?.allUsers);
  const storiesList = useSelector((state)=>state.story.storys?.allstorys)
  const dispatch = useDispatch()


  useEffect(()=>{
    getAllStories(dispatch)
  },[])

  console.log(storiesList)
  return (
    <div className="">
      <div className="bg-white rounded-md w-full p-10 tablet:flex justify-between gap-5 text-sm ">
        <div className="shadow-md w-[30%] p-2  py-3 gap-5 flex justify-around items-center bg-red-400 text-white font-bold rounded-md">
          <FontAwesomeIcon icon={faBook} size="xl" color="#E8EBF5"/>
          <div className="flex-1 h-full">
            <p className="text-2xl font-extrabold ">{storiesList.data.params.pagination.totalItems}</p>
            <p className="font-medium">Số lượng truyện</p>
          </div>
        </div>
        <div className="shadow-md w-[30%] p-2  py-3 gap-5 flex justify-around items-center bg-yellow-400 text-white font-bold rounded-md">
        <FontAwesomeIcon icon={faNewspaper} size="xl"  color="#E8EBF5"/>
          <div className="flex-1 h-full">
            <p className="text-2xl font-extrabold ">{storiesList.data.params.itemsUpdateInDay}</p>
            <p className="font-medium"> truyện cập nhật hôm nay</p>
          </div>
        </div>
        <div className="shadow-md w-[30%] p-2  py-3 gap-5 flex justify-around items-center bg-blue-400 text-white font-bold rounded-md">
        <FontAwesomeIcon icon={faUserSecret}  size="xl" color="#E8EBF5"/>
          <div className="flex-1 h-full">
            <p className="text-2xl font-extrabold ">{userList?.length}</p>
            <p className="font-medium">Người dùng</p>
          </div>
        </div>
        <div className=" shadow-md w-[30%] p-2  py-3 gap-5 flex justify-around items-center bg-green-400 text-white font-bold rounded-md">
        <FontAwesomeIcon icon={faBookOpenReader}  size="xl" color="#E8EBF5"/>
          <div className="flex-1 h-full">
            <p className="text-2xl font-extrabold ">50</p>
            <p className="font-medium">Lượt đọc truyện</p>
          </div>
        </div>
      </div>
      <div className="flex">
        <ChartComponent/>
        <div></div>
      </div>
    </div>
  );
};

export default Dasbroad;
