import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { fakerDE_CH as faker } from "@faker-js/faker";
import { getAllHistory } from "../../../services/apiStoriesRequest";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Biểu đồ số lượt đọc truyện",
    },
  },
};
export const optionsBarChart = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Biểu đồ cột số lượt đọc truyện của 1 truyện',
    },
  },
};

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const todayFormatted = formatDate(today);
const yesterdayFormatted = formatDate(yesterday);
const tomorrowFormatted = formatDate(tomorrow);

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

function ChartComponent() {

  const [viewOption, setViewOption] = useState("week");
  const [sortByOption, setSortByOption] = useState("highest");
  const [backgroundColor, setBackgroundColor] = useState([]);

  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Lượt đọc",
        data: [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 1,
      },
    ],
  });
  const [story, setStory] = useState({
    labels: [],
    datasets: [
      {
        label: "Lượt đọc",
        data: [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 1,
        backgroundColor: backgroundColor,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllHistory()
        if (res) {
          const readHistory = res;
          console.log(readHistory)

          // Initialize an object to store daily read counts
          const dailyReadCounts = {};

          // Process data to calculate daily read counts
          readHistory.forEach((entry) => {
            const date = new Date(entry.timestamp);
            let timeFrame = '';

            if (viewOption === "week") {
              timeFrame = date.toLocaleDateString("vi-VN", { weekday: "long" });
            } else if (viewOption === "month") {
              timeFrame = date.toLocaleDateString("vi-VN", { month: "long" });
            }

            if (!dailyReadCounts[timeFrame]) {
              dailyReadCounts[timeFrame] = 0;
            }

            dailyReadCounts[timeFrame] += entry.readCount;
          });

          // Extract labels and data from dailyReadCounts
          const labelData = Object.keys(dailyReadCounts);
          const readCounts = labelData.map(
            (dayOfWeek) => dailyReadCounts[dayOfWeek]
          );
          setData((prevState) => ({
            ...prevState,
            labels: labelData.reverse(),
            datasets: [
              {
                ...prevState.datasets[0], // Maintain other dataset properties
                data: readCounts,
              },
            ],
          }));

           // Process data based on sortByOption
           if (sortByOption === "highest") {
            readHistory.sort((a, b) => b.readCount - a.readCount);
          } else if (sortByOption === "lowest") {
            readHistory.sort((a, b) => a.readCount - b.readCount);
          }

          console.log(readHistory)
          const nameStory = readHistory.slice(0, 10).map((i) => i.storyInfo.item.name.slice(0, 10));
          const readCountStory = readHistory.slice(0, 10).map((i) => i.readCount);

          setStory((prevState) => ({
            ...prevState,
            labels: nameStory,
            datasets: [
              {
                ...prevState.datasets[0],
                data: readCountStory,
                backgroundColor: backgroundColor,
              },
            ],
          }));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [viewOption,sortByOption,backgroundColor]);

  useEffect(() => {
    const colorArray = []; // Tạo mảng chứa các màu sắc
    for (let i = 0; i < 10; i++) {
      colorArray.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`);
    }
    setBackgroundColor(colorArray); // Gán mảng màu sắc cho state backgroundColor
  }, []); 


  const handleViewChange = (event) => {
    setViewOption(event.target.value);
  };
  const handleSortByChange = (event) => {
    setSortByOption(event.target.value);
  };
  return (
    <div className="w-full h-full mt-5 flex flex-col gap-5">
      <div className="bg-white "><div>
        <select value={viewOption} onChange={handleViewChange}>
          <option value="week">Tuần</option>
          <option value="month">Tháng</option>
        </select>
      </div>
        <Line options={options} data={data} />
      </div>
      <div className="bg-white ">
      <div>
          <select value={sortByOption} onChange={handleSortByChange}>
            <option value="highest">Lượt xem cao nhất</option>
            <option value="lowest">Lượt xem thấp nhất</option>
          </select>
        </div>
        <Bar options={optionsBarChart} data={story} />
      </div>
    </div>
  );
}

export default ChartComponent;
