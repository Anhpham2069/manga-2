// FavoriteStories.js
import React from "react";
import NavBar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";

const FavoriteStories = () => {
  // Lấy danh sách truyện yêu thích từ Local Storage
  const favoriteStories = JSON.parse(localStorage.getItem("favorites")) || [];
    console.log(favoriteStories)
  return (
    <div>
        <NavBar/>
      <h2>Danh sách truyện yêu thích</h2>
      <ul>
        {favoriteStories?.map((story, index) => (
          <li key={index}>{story.seoOnPage?.titleHead}</li> // Hiển thị tên truyện (hoặc thông tin khác tùy ý)
        ))}
      </ul>
      <Footer/>
    </div>
  );
};

export default FavoriteStories;
