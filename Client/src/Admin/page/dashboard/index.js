import React, { useEffect, useState } from "react";
import ChartComponent from "./ChartComponest";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faNewspaper,
  faUserSecret,
  faEye,
  faHeart,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import {
  getAllStories,
  getNumberSaveStory,
  getAllErorr,
  getTotalStoryViews,
  getTodayStoryViews,
} from "../../../services/apiStoriesRequest";

const StatCard = ({ icon, value, label, color, subValue }) => (
  <div
    className={`${color} shadow-lg rounded-xl p-5 flex items-center gap-4 text-white transform transition hover:scale-105 hover:shadow-xl`}
  >
    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
      <FontAwesomeIcon icon={icon} size="xl" />
    </div>
    <div>
      <p className="text-3xl font-extrabold">{value}</p>
      <p className="text-sm font-medium opacity-90">{label}</p>
      {subValue && (
        <p className="text-xs mt-1 opacity-75">{subValue}</p>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const userList = useSelector((state) => state.user.users?.allUsers);
  const storiesList = useSelector((state) => state.story.storys?.allstorys);
  const dispatch = useDispatch();

  const [totalReads, setTotalReads] = useState(0);
  const [todayReads, setTodayReads] = useState(0);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [pendingErrors, setPendingErrors] = useState(0);

  useEffect(() => {
    getAllStories(dispatch);
  }, [dispatch]);

  // Fetch tổng lượt đọc (tất cả người dùng kể cả chưa đăng nhập)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Lấy tổng lượt xem từ StoryView (tất cả user)
        const viewsData = await getTotalStoryViews();
        setTotalReads(viewsData?.totalViews || 0);

        // Đếm lượt xem hôm nay từ DailyViewCount (chính xác)
        const todayData = await getTodayStoryViews();
        setTodayReads(todayData?.todayViews || 0);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStats();
  }, []);

  // Fetch tổng lượt theo dõi
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await getNumberSaveStory(dispatch);
        if (res) {
          const total = Object.values(res).reduce((sum, val) => sum + val, 0);
          setTotalFavorites(total);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFavorites();
  }, []);

  // Fetch báo lỗi
  useEffect(() => {
    const fetchErrors = async () => {
      try {
        const res = await getAllErorr();
        if (res) {
          setErrorCount(res.length);
          setPendingErrors(res.filter((e) => e.status !== "done").length);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchErrors();
  }, []);

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          icon={faBook}
          value={storiesList?.data?.params?.pagination?.totalItems || 0}
          label="Tổng số truyện"
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          subValue={`${storiesList?.data?.params?.itemsUpdateInDay || 0} cập nhật hôm nay`}
        />
        <StatCard
          icon={faEye}
          value={totalReads.toLocaleString()}
          label="Tổng lượt đọc"
          color="bg-gradient-to-r from-green-500 to-emerald-600"
          subValue={`${todayReads.toLocaleString()} lượt hôm nay`}
        />
        <StatCard
          icon={faUserSecret}
          value={userList?.length || 0}
          label="Người dùng"
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <StatCard
          icon={faHeart}
          value={totalFavorites.toLocaleString()}
          label="Tổng lượt theo dõi"
          color="bg-gradient-to-r from-pink-500 to-rose-500"
        />
        <StatCard
          icon={faNewspaper}
          value={storiesList?.data?.params?.itemsUpdateInDay || 0}
          label="Truyện cập nhật hôm nay"
          color="bg-gradient-to-r from-amber-500 to-orange-500"
        />
        <StatCard
          icon={faExclamationTriangle}
          value={errorCount}
          label="Báo lỗi"
          color={pendingErrors > 0
            ? "bg-gradient-to-r from-red-500 to-red-600"
            : "bg-gradient-to-r from-gray-500 to-gray-600"
          }
          subValue={pendingErrors > 0 ? `${pendingErrors} chưa xử lý` : "Tất cả đã xử lý"}
        />
      </div>

      {/* Charts */}
      <div className="mt-6">
        <ChartComponent />
      </div>
    </div>
  );
};

export default Dashboard;
