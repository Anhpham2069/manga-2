import React, { useEffect, useState, useRef, useCallback } from "react";
import { Carousel } from "antd";
import "./slider.css";
import { Link } from "react-router-dom";
import { getStoriesByList } from "../../services/apiStoriesRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const AUTOPLAY_INTERVAL = 5000;
const SLIDE_COUNT = 5;

const Slider = () => {
  const [storiesData, setStoriesData] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const carouselRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStoriesByList("truyen-moi");
        if (res.data) {
          setStoriesData(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Progress bar animation
  useEffect(() => {
    setProgress(0);
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / AUTOPLAY_INTERVAL) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        progressRef.current = requestAnimationFrame(animate);
      }
    };

    progressRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(progressRef.current);
  }, [activeSlide]);

  const handleBeforeChange = useCallback((_, next) => {
    setActiveSlide(next);
  }, []);

  const items = storiesData.items?.slice(0, SLIDE_COUNT) || [];

  return (
    <div className="slider-wrapper">
      {/* Prev Button */}
      <button
        onClick={() => carouselRef.current?.prev()}
        className="slider-nav slider-nav--prev"
        aria-label="Previous slide"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      {/* Next Button */}
      <button
        onClick={() => carouselRef.current?.next()}
        className="slider-nav slider-nav--next"
        aria-label="Next slide"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>

      <Carousel
        autoplay
        autoplaySpeed={AUTOPLAY_INTERVAL}
        ref={carouselRef}
        dots={false}
        beforeChange={handleBeforeChange}
      >
        {items.map((item, index) => {
          const imgUrl = `https://img.otruyenapi.com${storiesData.seoOnPage?.og_image?.[index]}`;
          return (
            <Link to={`detail/${item.slug}`} key={item._id}>
              <div className="slider-slide">
                {/* Blurred background */}
                <div
                  className="slider-bg"
                  style={{ backgroundImage: `url(${imgUrl})` }}
                />
                <div className="slider-overlay" />

                {/* Content */}
                <div className="slider-content">
                  <div className="slider-info">
                    <span className="slider-chapter">
                      Chương{" "}
                      {item.chaptersLatest?.[0]?.chapter_name || "N/A"}
                    </span>
                    <h2 className="slider-title">{item.name}</h2>
                    <div className="slider-categories">
                      {item?.category?.slice(0, 4).map((cate, i) => (
                        <span className="slider-category" key={i}>
                          {cate.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Cover image */}
                  <div className="slider-cover-wrapper">
                    <img
                      className="slider-cover"
                      src={imgUrl}
                      alt={item.name}
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </Carousel>

      {/* Progress bar */}
      <div className="slider-progress">
        <div
          className="slider-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Slider;
