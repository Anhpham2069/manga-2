import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Get history from Local Storage
    const existingHistory = localStorage.getItem("history");

    console.log(existingHistory )
    if (existingHistory) {
      // Parse history from string to array
      const parsedHistory = JSON.parse(existingHistory);
      setHistory(parsedHistory);
    }
  }, []);

  return (
    <div>
          <NavBar/>
      <h2>Lịch sử đọc truyện</h2>
      <ul>
        {history?.map((item, index) => (
          <li key={index}>
            {/* Here you can display whatever information you want from the history item */}
            <Link to={`/detail/${item.slug}`}>Truyện: {item.slug}</Link> -{" "}
            {new Date(item.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
      <Footer />
    </div>
  );
};

export default History;
