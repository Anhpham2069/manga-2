import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const HelmetManager = () => {
    const location = useLocation();

    const [seo, setSeo] = useState({
        siteTitle: "Manga Web - Đọc Truyện Tranh Online",
        siteDescription: "Website đọc truyện tranh online miễn phí cập nhật liên tục.",
        keywords: "truyen tranh, manga, doc truyen tranh online",
        ogImage: "",
        favicon: "",
        allStoriesTitle: "", allStoriesDesc: "",
        rankingTitle: "", rankingDesc: "",
        filterTitle: "", filterDesc: "",
        historyTitle: "", historyDesc: "",
        favoritesTitle: "", favoritesDesc: ""
    });

    useEffect(() => {
        const fetchSeo = async () => {
            try {
                const apiURL = process.env.REACT_APP_API_URL || "http://localhost:8000";
                const res = await axios.get(`${apiURL}/api/seo`);
                if (res.data) {
                    setSeo(prev => ({ ...prev, ...res.data }));
                }
            } catch (err) {
                console.error("Lỗi tải SEO data", err);
            }
        };
        fetchSeo();
    }, []);

    let currentTitle = seo.siteTitle;
    let currentDesc = seo.siteDescription;

    if (location.pathname.startsWith('/all-stories')) {
        currentTitle = seo.allStoriesTitle || currentTitle;
        currentDesc = seo.allStoriesDesc || currentDesc;
    } else if (location.pathname.startsWith('/ranking')) {
        currentTitle = seo.rankingTitle || currentTitle;
        currentDesc = seo.rankingDesc || currentDesc;
    } else if (location.pathname.startsWith('/filter')) {
        currentTitle = seo.filterTitle || currentTitle;
        currentDesc = seo.filterDesc || currentDesc;
    } else if (location.pathname.startsWith('/history')) {
        currentTitle = seo.historyTitle || currentTitle;
        currentDesc = seo.historyDesc || currentDesc;
    } else if (location.pathname.startsWith('/favorites')) {
        currentTitle = seo.favoritesTitle || currentTitle;
        currentDesc = seo.favoritesDesc || currentDesc;
    }

    return (
        <Helmet>
            <title>{currentTitle}</title>
            <meta name="description" content={currentDesc} />
            <meta name="keywords" content={seo.keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={currentTitle} />
            <meta property="og:description" content={currentDesc} />
            {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}

            {/* Favicon / Icon */}
            {seo.favicon && <link rel="icon" type="image/png" href={seo.favicon} />}
            {seo.favicon && <link rel="apple-touch-icon" href={seo.favicon} />}
        </Helmet>
    );
}

export default HelmetManager;
