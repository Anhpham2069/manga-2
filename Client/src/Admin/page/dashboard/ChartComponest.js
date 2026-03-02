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
import { useSelector, useDispatch } from "react-redux";
import { selectDarkMode } from "../../../components/layout/DarkModeSlice";
import {
  getAllHistory,
  getRanking,
  getNumberSaveStory,
} from "../../../services/apiStoriesRequest";

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

// ===== COLORS =====
const CHART_COLORS = [
  "#6366f1", // indigo
  "#06b6d4", // cyan
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
  "#3b82f6", // blue
  "#22c55e", // green
];

// ===== CHART CARD WRAPPER =====
const ChartCard = ({ title, children, className = "", dark }) => (
  <div
    className={`rounded-2xl p-6 transition-all duration-300 ${dark
      ? "bg-[#1e293b] border border-[#334155]"
      : "bg-white border border-gray-100 shadow-lg shadow-gray-100/50"
      } ${className}`}
  >
    <h3
      className={`text-base font-bold mb-5 flex items-center gap-2 ${dark ? "text-gray-200" : "text-gray-700"
        }`}
    >
      {title}
    </h3>
    {children}
  </div>
);

function ChartComponent() {
  const isDark = useSelector(selectDarkMode);
  const dispatch = useDispatch();
  const [readsByDay, setReadsByDay] = useState({ labels: [], data: [] });
  const [topStories, setTopStories] = useState({ labels: [], data: [] });
  const [categoryData, setCategoryData] = useState({ labels: [], data: [] });
  const [favData, setFavData] = useState({ labels: [], data: [] });

  // ===== THEME COLORS =====
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const textColor = isDark ? "#94a3b8" : "#64748b";
  const tooltipBg = isDark ? "#1e293b" : "#ffffff";
  const tooltipBorder = isDark ? "#334155" : "#e2e8f0";
  const tooltipText = isDark ? "#e2e8f0" : "#334155";

  // Shared tooltip config
  const tooltipConfig = {
    backgroundColor: tooltipBg,
    borderColor: tooltipBorder,
    borderWidth: 1,
    titleColor: tooltipText,
    bodyColor: tooltipText,
    padding: 12,
    cornerRadius: 10,
    titleFont: { size: 13, weight: "bold" },
    bodyFont: { size: 12 },
    displayColors: true,
    boxPadding: 4,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const history = await getAllHistory();
        if (!history || history.length === 0) return;

        // --- 1. Lượt đọc 7 ngày ---
        const last7Days = [];
        const dayLabels = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          d.setHours(0, 0, 0, 0);
          last7Days.push(d);
          dayLabels.push(
            d.toLocaleDateString("vi-VN", {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
            })
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

        // --- 2. Thể loại ---
        const categoryCount = {};
        history.forEach((item) => {
          const categories =
            item.storyInfo?.breadCrumb ||
            item.storyInfo?.item?.category ||
            [];
          categories.forEach((cat) => {
            if (cat.name && cat.name !== "Truyện Tranh") {
              categoryCount[cat.name] =
                (categoryCount[cat.name] || 0) + (item.readCount || 1);
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

  // --- 3. Top truyện từ ranking ---
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const ranking = await getRanking("week");
        if (ranking && ranking.length > 0) {
          const top10 = ranking.slice(0, 10);
          setTopStories({
            labels: top10.map(
              (item) =>
                (item.storyInfo?.item?.name || item._id || "").slice(0, 18)
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

  // --- 4. Favorites ---
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await getNumberSaveStory(dispatch);
        if (res) {
          const sorted = Object.entries(res)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);
          setFavData({
            labels: sorted.map(([slug]) =>
              slug.replace(/-/g, " ").slice(0, 20)
            ),
            data: sorted.map(([, count]) => count),
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFavorites();
  }, []);

  // ===== 1. LINE CHART - Lượt đọc 7 ngày =====
  const lineData = {
    labels: readsByDay.labels,
    datasets: [
      {
        label: "Lượt đọc",
        data: readsByDay.data,
        borderColor: "#6366f1",
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(99, 102, 241, 0.3)");
          gradient.addColorStop(1, "rgba(99, 102, 241, 0.01)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: isDark ? "#1e293b" : "#fff",
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 9,
        borderWidth: 3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800, easing: "easeInOutQuart" },
    plugins: {
      legend: { display: false },
      tooltip: tooltipConfig,
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0, color: textColor, font: { size: 11 } },
        grid: { color: gridColor },
        border: { display: false },
      },
      x: {
        ticks: { color: textColor, font: { size: 11 } },
        grid: { display: false },
        border: { display: false },
      },
    },
  };

  // ===== 2. BAR CHART - Top truyện =====
  const barData = {
    labels: topStories.labels,
    datasets: [
      {
        label: "Lượt xem tuần này",
        data: topStories.data,
        backgroundColor: topStories.data.map(
          (_, i) => CHART_COLORS[i % CHART_COLORS.length] + "cc"
        ),
        borderColor: topStories.data.map(
          (_, i) => CHART_COLORS[i % CHART_COLORS.length]
        ),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800, easing: "easeInOutQuart" },
    plugins: {
      legend: { display: false },
      tooltip: tooltipConfig,
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0, color: textColor, font: { size: 11 } },
        grid: { color: gridColor },
        border: { display: false },
      },
      x: {
        ticks: {
          color: textColor,
          font: { size: 10 },
          maxRotation: 45,
          minRotation: 30,
        },
        grid: { display: false },
        border: { display: false },
      },
    },
  };

  // ===== 3. DOUGHNUT CHART - Thể loại =====
  const doughnutData = {
    labels: categoryData.labels,
    datasets: [
      {
        data: categoryData.data,
        backgroundColor: categoryData.data.map(
          (_, i) => CHART_COLORS[i % CHART_COLORS.length] + "cc"
        ),
        borderColor: isDark ? "#1e293b" : "#ffffff",
        borderWidth: 3,
        hoverOffset: 12,
        hoverBorderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    animation: { duration: 800, easing: "easeInOutQuart" },
    plugins: {
      legend: {
        position: "right",
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
          color: textColor,
          font: { size: 12 },
        },
      },
      tooltip: tooltipConfig,
    },
  };

  // ===== 4. HORIZONTAL BAR - Favorites =====
  const favBarData = {
    labels: favData.labels,
    datasets: [
      {
        label: "Lượt theo dõi",
        data: favData.data,
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 400, 0);
          gradient.addColorStop(0, "rgba(236, 72, 153, 0.8)");
          gradient.addColorStop(1, "rgba(139, 92, 246, 0.8)");
          return gradient;
        },
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 22,
      },
    ],
  };

  const favBarOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800, easing: "easeInOutQuart" },
    plugins: {
      legend: { display: false },
      tooltip: tooltipConfig,
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { precision: 0, color: textColor, font: { size: 11 } },
        grid: { color: gridColor },
        border: { display: false },
      },
      y: {
        ticks: { color: textColor, font: { size: 11 } },
        grid: { display: false },
        border: { display: false },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Line Chart - Lượt đọc 7 ngày */}
      <ChartCard
        title="📈 Lượt đọc 7 ngày gần nhất"
        className="lg:col-span-2"
        dark={isDark}
      >
        <div className="h-[280px]">
          <Line options={lineOptions} data={lineData} />
        </div>
      </ChartCard>

      {/* Bar Chart - Top truyện */}
      <ChartCard title="🏆 Top 10 truyện xem nhiều nhất tuần" dark={isDark}>
        <div className="h-[320px]">
          <Bar options={barOptions} data={barData} />
        </div>
      </ChartCard>

      {/* Doughnut Chart - Thể loại */}
      <ChartCard title="📊 Phân bố thể loại đọc nhiều" dark={isDark}>
        <div className="h-[320px] flex items-center justify-center">
          <Doughnut options={doughnutOptions} data={doughnutData} />
        </div>
      </ChartCard>

      {/* Horizontal Bar - Favorites */}
      <ChartCard
        title="❤️ Top truyện được theo dõi nhiều nhất"
        className="lg:col-span-2"
        dark={isDark}
      >
        <div className="h-[280px]">
          <Bar options={favBarOptions} data={favBarData} />
        </div>
      </ChartCard>
    </div>
  );
}

export default ChartComponent;
