import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { fakerDE_CH as faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Lượt đọc",
        data: [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  });
  console.log(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/history/get-all`
        );
        if (res.data) {
          const readHistory = res.data;

          // Initialize an object to store daily read counts
          const dailyReadCounts = {};

          // Process data to calculate daily read counts
          readHistory.forEach((entry) => {
            // Extract day of the week from timestamp
            const date = new Date(entry.timestamp);
            const dayOfWeek = date.toLocaleDateString("vi-VN", {
              weekday: "long",
            });
            console.log(dayOfWeek);

            // Initialize read count for the day if not already initialized
            if (!dailyReadCounts[dayOfWeek]) {
              dailyReadCounts[dayOfWeek] = 0;
            }

            // Add read count to the corresponding day
            dailyReadCounts[dayOfWeek] += entry.readCount;
          });

          // Extract labels and data from dailyReadCounts
          const labelData = Object.keys(dailyReadCounts);
          const readCounts = labelData.map(
            (dayOfWeek) => dailyReadCounts[dayOfWeek]
          );
          console.log(labelData);
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
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="w-full h-full mt-5">
      <div className="bg-white w-1/2">
        <Line options={options} data={data} />
      </div>
    </div>
  )
}

export default ChartComponent;
