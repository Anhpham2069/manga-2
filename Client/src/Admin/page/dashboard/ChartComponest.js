import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { getAllHistory, getRanking } from "../../../services/apiStoriesRequest";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Màu sắc nhất quán
const COLORS = [
  "rgba(59, 130, 246, 0.7)",   // blue
  "rgba(16, 185, 129, 0.7)",   // green
  "rgba(245, 158, 11, 0.7)",   // amber
  "rgba(239, 68, 68, 0.7)",    // red
  "rgba(139, 92, 246, 0.7)",   // purple
  "rgba(236, 72, 153, 0.7)",   // pink
  "rgba(20, 184, 166, 0.7)",   // teal
  "rgba(249, 115, 22, 0.7)",   // orange
  "rgba(99, 102, 241, 0.7)",   // indigo
  "rgba(34, 197, 94, 0.7)",    // emerald
];

const BORDER_COLORS = COLORS.map((c) => c.replace("0.7", "1"));

function ChartComponent() {
  const [readsByDay, setReadsByDay] = useState({ labels: [], data: [] });
  const [topStories, setTopStories] = useState({ labels: [], data: [] });
  const [categoryData, setCategoryData] = useState({ labels: [], data: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const history = await getAllHistory();
        if (!history || history.length === 0) return;

        // --- 1. Biểu đồ lượt đọc 7 ngày gần nhất ---
        const last7Days = [];
        const dayLabels = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          d.setHours(0, 0, 0, 0);
          last7Days.push(d);
          dayLabels.push(
            d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
          );
        }

        const dailyCounts = last7Days.map((day) => {
          const nextDay = new Date(day);
          nextDay.setDate(nextDay.getDate() + 1);
          return history
            .filter((item) => {
              const t = new Date(item.timestamp);
              return t >= day && t < nextDay;
            })
            .reduce((sum, item) => sum + (item.readCount || 0), 0);
        });

        setReadsByDay({ labels: dayLabels, data: dailyCounts });

        // --- 2. Biểu đồ thể loại (từ storyInfo.breadCrumb) ---
        const categoryCount = {};
        history.forEach((item) => {
          const categories = item.storyInfo?.breadCrumb || item.storyInfo?.item?.category || [];
          categories.forEach((cat) => {
            if (cat.name && cat.name !== "Truyện Tranh") {
              categoryCount[cat.name] = (categoryCount[cat.name] || 0) + (item.readCount || 1);
            }
          });
        });

        const sortedCategories = Object.entries(categoryCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8);

        setCategoryData({
          labels: sortedCategories.map(([name]) => name),
          data: sortedCategories.map(([, count]) => count),
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // --- 3. Biểu đồ top truyện xem nhiều từ ranking API ---
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const ranking = await getRanking("week");
        if (ranking && ranking.length > 0) {
          const top10 = ranking.slice(0, 10);
          setTopStories({
            labels: top10.map((item) =>
              (item.storyInfo?.item?.name || item._id || "").slice(0, 15)
            ),
            data: top10.map((item) => item.totalViews || 0),
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRanking();
  }, []);

  // Chart configs
  const lineChartData = {
    labels: readsByDay.labels,
    datasets: [
      {
        label: "Lượt đọc",
        data: readsByDay.data,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Lượt đọc 7 ngày gần nhất",
        font: { size: 16, weight: "bold" },
        padding: { bottom: 20 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const barChartData = {
    labels: topStories.labels,
    datasets: [
      {
        label: "Lượt xem tuần này",
        data: topStories.data,
        backgroundColor: COLORS.slice(0, topStories.data.length),
        borderColor: BORDER_COLORS.slice(0, topStories.data.length),
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Top 10 truyện xem nhiều nhất tuần",
        font: { size: 16, weight: "bold" },
        padding: { bottom: 20 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
      x: {
        grid: { display: false },
        ticks: { maxRotation: 45, minRotation: 45 },
      },
    },
  };

  const doughnutChartData = {
    labels: categoryData.labels,
    datasets: [
      {
        data: categoryData.data,
        backgroundColor: COLORS.slice(0, categoryData.data.length),
        borderColor: "#fff",
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: { padding: 15, usePointStyle: true, pointStyle: "circle" },
      },
      title: {
        display: true,
        text: "Phân bố thể loại đọc nhiều",
        font: { size: 16, weight: "bold" },
        padding: { bottom: 10 },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Line Chart - Lượt đọc 7 ngày */}
      <div className="bg-white rounded-xl shadow-md p-5 lg:col-span-2">
        <Line options={lineChartOptions} data={lineChartData} height={80} />
      </div>

      {/* Bar Chart - Top truyện */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <Bar options={barChartOptions} data={barChartData} />
      </div>

      {/* Doughnut Chart - Thể loại */}
      <div className="bg-white rounded-xl shadow-md p-5 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Doughnut options={doughnutChartOptions} data={doughnutChartData} />
        </div>
      </div>
    </div>
  );
}

export default ChartComponent;
