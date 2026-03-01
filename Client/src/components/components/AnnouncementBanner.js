import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn, faTimes } from "@fortawesome/free-solid-svg-icons";

const API_URL = process.env.REACT_APP_API_URL;

const AnnouncementBanner = () => {
    const [announcement, setAnnouncement] = useState(null);
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                // Kiểm tra sessionStorage xem user đã đóng banner chưa
                const dismissed = sessionStorage.getItem("announcement_dismissed");
                if (dismissed) {
                    setVisible(false);
                    return;
                }

                const res = await axios.get(`${API_URL}/api/noti/noti/active`);
                if (res.data) {
                    // Nếu user đã đóng thông báo cụ thể này rồi thì không hiện lại
                    const dismissedId = sessionStorage.getItem("announcement_dismissed_id");
                    if (dismissedId === res.data._id) {
                        setVisible(false);
                        return;
                    }
                    setAnnouncement(res.data);
                }
            } catch (error) {
                console.log("Không thể tải thông báo");
            }
        };

        fetchAnnouncement();
    }, []);

    // Tự động tắt sau 5 giây
    useEffect(() => {
        if (!announcement || !visible) return;
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => handleClose(), 500);
        }, 5000);
        return () => clearTimeout(timer);
    }, [announcement, visible]);

    const handleClose = () => {
        setFadeOut(true);
        setTimeout(() => {
            setVisible(false);
            if (announcement) {
                sessionStorage.setItem("announcement_dismissed", "true");
                sessionStorage.setItem("announcement_dismissed_id", announcement._id);
            }
        }, 300);
    };

    if (!visible || !announcement) return null;

    return (
        <div
            className="w-full"
            style={{
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                animation: fadeOut ? "fadeOutUp 0.5s ease-out forwards" : "slideDown 0.4s ease-out",
            }}
        >
            <style>
                {`
          @keyframes slideDown {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes fadeOutUp {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(-100%); opacity: 0; }
          }
        `}
            </style>
            <div className="max-w-[90%] mx-auto flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span
                        className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full"
                        style={{ background: "rgba(255,255,255,0.2)" }}
                    >
                        <FontAwesomeIcon icon={faBullhorn} className="text-white text-sm" />
                    </span>
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        {announcement.title && (
                            <span className="font-bold text-white text-sm whitespace-nowrap">
                                {announcement.title}:
                            </span>
                        )}
                        <span className="text-white text-sm truncate">
                            {announcement.message}
                        </span>
                    </div>
                </div>
                <button
                    onClick={handleClose}
                    className="flex-shrink-0 ml-3 text-white hover:text-gray-200 transition-colors duration-200 p-1"
                    style={{ background: "transparent", border: "none", cursor: "pointer" }}
                >
                    <FontAwesomeIcon icon={faTimes} className="text-base" />
                </button>
            </div>
        </div>
    );
};

export default AnnouncementBanner;
