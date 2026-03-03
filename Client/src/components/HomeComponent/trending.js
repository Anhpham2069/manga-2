import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFire,
    faChevronLeft,
    faChevronRight,
    faEye,
    faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./trending.css";

const apiURL = process.env.REACT_APP_API_URL;
const apiURLOTruyen = process.env.REACT_APP_API_URL_OTruyen;

const Trending = ({ dark }) => {
    const [stories, setStories] = useState([]);
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                // Get top viewed stories from our API
                const res = await axios.get(`${apiURL}/api/views/top?limit=14`);
                const topStories = res.data;

                // For each story, fetch detail from otruyenapi to get chapter info
                const enriched = await Promise.all(
                    topStories.map(async (story) => {
                        try {
                            const detail = await axios.get(
                                `${apiURLOTruyen}/truyen-tranh/${story.slug}`
                            );
                            const item = detail.data?.data?.item;
                            return {
                                slug: story.slug,
                                name: item?.name || story.storyName || story.slug,
                                viewCount: story.viewCount,
                                thumb: `https://img.otruyenapi.com/uploads/comics/${story.slug}-thumb.jpg`,
                                chaptersLatest: item?.chaptersLatest,
                            };
                        } catch {
                            return {
                                slug: story.slug,
                                name: story.storyName || story.slug,
                                viewCount: story.viewCount,
                                thumb: `https://img.otruyenapi.com/uploads/comics/${story.slug}-thumb.jpg`,
                                chaptersLatest: null,
                            };
                        }
                    })
                );

                setStories(enriched);
            } catch (error) {
                console.error("Error fetching trending:", error);
            }
        };

        fetchTrending();
    }, []);

    const checkScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener("scroll", checkScroll, { passive: true });
        checkScroll();
        return () => el.removeEventListener("scroll", checkScroll);
    }, [stories, checkScroll]);

    const scroll = (dir) => {
        const el = scrollRef.current;
        if (!el) return;
        const amount = el.clientWidth * 0.7;
        el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    };

    const formatViews = (count) => {
        if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, "") + "K";
        return count;
    };

    return (
        <div className={`trending-section ${dark ? "trending--dark" : ""}`}>
            {/* Header */}
            <div className="trending-header">
                <div className="trending-label">
                    <FontAwesomeIcon icon={faFire} className="trending-icon" />
                    <span>Xu hướng</span>
                </div>
                <div className="trending-arrows">
                    <button
                        className={`trending-arrow ${!canScrollLeft ? "trending-arrow--disabled" : ""}`}
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button
                        className={`trending-arrow ${!canScrollRight ? "trending-arrow--disabled" : ""}`}
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            </div>

            {/* Scrollable cards */}
            <div className="trending-scroll" ref={scrollRef}>
                {stories.map((story, index) => (
                    <Link
                        to={`/detail/${story.slug}`}
                        key={story.slug}
                        className="trending-card"
                    >
                        <div className="trending-card-img-wrap">
                            <img
                                src={story.thumb}
                                alt={story.name}
                                className="trending-card-img"
                                loading="lazy"
                            />

                            {/* HOT badge */}
                            <span className="trending-badge">HOT</span>

                            {/* Bottom overlay info */}
                            <div className="trending-card-overlay">
                                <span className="trending-stat">
                                    <FontAwesomeIcon icon={faBookOpen} />
                                    {story.chaptersLatest?.[0]?.chapter_name || "?"}
                                </span>
                                <span className="trending-stat">
                                    <FontAwesomeIcon icon={faEye} />
                                    {formatViews(story.viewCount)}
                                </span>
                            </div>
                        </div>

                        <p className="trending-card-title">{story.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Trending;
