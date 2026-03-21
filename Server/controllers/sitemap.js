const axios = require("axios");
const Genre = require("../models/genres");

const SITE_URL = "https://manga-2-client.vercel.app";
const OTRUYEN_API = "https://otruyenapi.com/v1/api";
const MAX_URLS_PER_SITEMAP = 5000;

// Các trang tĩnh
const staticPages = [
    { loc: "/", changefreq: "daily", priority: "1.0" },
    { loc: "/all-stories", changefreq: "daily", priority: "0.9" },
    { loc: "/ranking", changefreq: "daily", priority: "0.8" },
    { loc: "/filter", changefreq: "weekly", priority: "0.7" },
    { loc: "/contact", changefreq: "monthly", priority: "0.4" },
    { loc: "/login", changefreq: "monthly", priority: "0.3" },
    { loc: "/register", changefreq: "monthly", priority: "0.3" },
    { loc: "/history", changefreq: "daily", priority: "0.5" },
    { loc: "/favorites", changefreq: "daily", priority: "0.6" },
];

/**
 * Lấy danh sách tất cả truyện từ OTruyen API (nhiều trang)
 */
const fetchAllStories = async () => {
    const stories = [];
    try {
        // Lấy trang đầu tiên để biết tổng số trang
        const firstPage = await axios.get(`${OTRUYEN_API}/danh-sach/truyen-moi`, {
            params: { page: 1 },
            timeout: 10000,
        });

        const totalPages = firstPage.data?.data?.params?.pagination?.totalItems
            ? Math.ceil(firstPage.data.data.params.pagination.totalItems / 24)
            : 1;

        // Lấy truyện từ trang đầu
        if (firstPage.data?.data?.items) {
            stories.push(...firstPage.data.data.items);
        }

        // Lấy tối đa 50 trang để tránh quá tải
        const maxPages = Math.min(totalPages, 50);

        // Lấy các trang còn lại (song song, mỗi batch 5 trang)
        for (let i = 2; i <= maxPages; i += 5) {
            const batch = [];
            for (let j = i; j < Math.min(i + 5, maxPages + 1); j++) {
                batch.push(
                    axios.get(`${OTRUYEN_API}/danh-sach/truyen-moi`, {
                        params: { page: j },
                        timeout: 10000,
                    }).catch(() => null)
                );
            }
            const results = await Promise.all(batch);
            results.forEach((res) => {
                if (res?.data?.data?.items) {
                    stories.push(...res.data.data.items);
                }
            });
        }
    } catch (error) {
        console.error("Error fetching stories for sitemap:", error.message);
    }
    return stories;
};

/**
 * Lấy danh sách thể loại từ OTruyen API
 */
const fetchCategories = async () => {
    try {
        const res = await axios.get(`${OTRUYEN_API}/the-loai`, { timeout: 10000 });
        return res.data?.data?.items || [];
    } catch (error) {
        console.error("Error fetching categories for sitemap:", error.message);
        // Fallback: lấy từ database
        try {
            const genres = await Genre.find({});
            return genres.map((g) => ({ slug: g.slug, name: g.genreName }));
        } catch (e) {
            return [];
        }
    }
};

/**
 * Escape các ký tự đặc biệt trong XML
 */
const escapeXml = (str) => {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
};

/**
 * Lấy chi tiết truyện (bao gồm chapter list) từ OTruyen API
 */
const fetchStoryDetail = async (slug) => {
    try {
        const res = await axios.get(`${OTRUYEN_API}/truyen-tranh/${slug}`, { timeout: 10000 });
        return res.data?.data || null;
    } catch (error) {
        return null;
    }
};

/**
 * Lấy tất cả chapter URLs từ danh sách truyện
 * Trả về mảng { loc, lastmod }
 */
const fetchAllChapterUrls = async (stories) => {
    const chapterUrls = [];

    // Chia thành batch để tránh quá tải API
    const batchSize = 5;
    for (let i = 0; i < stories.length; i += batchSize) {
        const batch = stories.slice(i, i + batchSize);
        const results = await Promise.all(
            batch.map(async (story) => {
                if (!story.slug) return [];
                try {
                    const detail = await fetchStoryDetail(story.slug);
                    const serverData = detail?.item?.chapters?.[0]?.server_data || [];
                    const updatedAt = story.updatedAt
                        ? new Date(story.updatedAt).toISOString().split("T")[0]
                        : new Date().toISOString().split("T")[0];

                    return serverData.map((chap) => {
                        const chapterId = chap.chapter_api_data?.split("/").pop();
                        if (!chapterId) return null;
                        return {
                            loc: `${SITE_URL}/detail/${escapeXml(story.slug)}/view/${escapeXml(chapterId)}`,
                            lastmod: updatedAt,
                        };
                    }).filter(Boolean);
                } catch {
                    return [];
                }
            })
        );
        results.forEach((urls) => chapterUrls.push(...urls));
    }

    return chapterUrls;
};

/**
 * GET /api/seo/sitemap.xml
 * Generate sitemap XML động (trang tĩnh + thể loại + truyện)
 */
exports.generateSitemap = async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0];

        // Fetch song song
        const [stories, categories] = await Promise.all([
            fetchAllStories(),
            fetchCategories(),
        ]);

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // 1. Trang tĩnh
        for (const page of staticPages) {
            xml += `  <url>\n`;
            xml += `    <loc>${SITE_URL}${page.loc}</loc>\n`;
            xml += `    <lastmod>${today}</lastmod>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;
            xml += `  </url>\n`;
        }

        // 2. Trang thể loại
        for (const cat of categories) {
            if (cat.slug) {
                xml += `  <url>\n`;
                xml += `    <loc>${SITE_URL}/category/${escapeXml(cat.slug)}</loc>\n`;
                xml += `    <lastmod>${today}</lastmod>\n`;
                xml += `    <changefreq>daily</changefreq>\n`;
                xml += `    <priority>0.7</priority>\n`;
                xml += `  </url>\n`;
            }
        }

        // 3. Trang chi tiết truyện
        for (const story of stories) {
            if (story.slug) {
                const updatedAt = story.updatedAt
                    ? new Date(story.updatedAt).toISOString().split("T")[0]
                    : today;
                xml += `  <url>\n`;
                xml += `    <loc>${SITE_URL}/detail/${escapeXml(story.slug)}</loc>\n`;
                xml += `    <lastmod>${updatedAt}</lastmod>\n`;
                xml += `    <changefreq>weekly</changefreq>\n`;
                xml += `    <priority>0.8</priority>\n`;
                xml += `  </url>\n`;
            }
        }

        xml += `</urlset>`;

        res.set("Content-Type", "application/xml");
        res.set("Cache-Control", "public, max-age=3600"); // Cache 1 giờ
        res.status(200).send(xml);
    } catch (error) {
        console.error("Error generating sitemap:", error);
        res.status(500).json({ message: "Error generating sitemap" });
    }
};

/**
 * GET /api/seo/sitemap-chapters-:page.xml
 * Sitemap XML cho chapters (phân trang, mỗi file tối đa 5000 URLs)
 */
exports.generateChapterSitemap = async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1;

        // Fetch tất cả truyện
        const stories = await fetchAllStories();

        // Chỉ lấy truyện có chapter
        const storiesWithChapters = stories.filter(
            (s) => s.chaptersLatest && s.chaptersLatest.length > 0 && s.chaptersLatest[0]?.chapter_name
        );

        // Fetch tất cả chapter URLs
        const allChapterUrls = await fetchAllChapterUrls(storiesWithChapters);

        // Phân trang
        const startIdx = (page - 1) * MAX_URLS_PER_SITEMAP;
        const endIdx = startIdx + MAX_URLS_PER_SITEMAP;
        const pageUrls = allChapterUrls.slice(startIdx, endIdx);

        if (pageUrls.length === 0) {
            return res.status(404).json({ message: "Sitemap page not found" });
        }

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        for (const chapter of pageUrls) {
            xml += `  <url>\n`;
            xml += `    <loc>${chapter.loc}</loc>\n`;
            xml += `    <lastmod>${chapter.lastmod}</lastmod>\n`;
            xml += `    <changefreq>monthly</changefreq>\n`;
            xml += `    <priority>0.6</priority>\n`;
            xml += `  </url>\n`;
        }

        xml += `</urlset>`;

        res.set("Content-Type", "application/xml");
        res.set("Cache-Control", "public, max-age=7200"); // Cache 2 giờ
        res.status(200).send(xml);
    } catch (error) {
        console.error("Error generating chapter sitemap:", error);
        res.status(500).json({ message: "Error generating chapter sitemap" });
    }
};

/**
 * GET /api/seo/sitemap-chapters-count
 * Trả về số trang sitemap chapters
 */
exports.getChapterSitemapCount = async (req, res) => {
    try {
        const stories = await fetchAllStories();
        const storiesWithChapters = stories.filter(
            (s) => s.chaptersLatest && s.chaptersLatest.length > 0 && s.chaptersLatest[0]?.chapter_name
        );

        // Ước tính: trung bình mỗi truyện ~50 chapters
        const estimatedTotal = storiesWithChapters.length * 50;
        const totalPages = Math.ceil(estimatedTotal / MAX_URLS_PER_SITEMAP) || 1;

        res.json({ totalPages, estimatedChapters: estimatedTotal });
    } catch (error) {
        console.error("Error getting chapter sitemap count:", error);
        res.status(500).json({ message: "Error" });
    }
};

/**
 * GET /api/seo/sitemap-index.xml
 * Sitemap index bao gồm sitemap chính + các sitemap chapters
 */
exports.generateSitemapIndex = async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0];
        const serverUrl = `${req.protocol}://${req.get("host")}`;

        // Tính số trang sitemap chapters
        const stories = await fetchAllStories();
        const storiesWithChapters = stories.filter(
            (s) => s.chaptersLatest && s.chaptersLatest.length > 0 && s.chaptersLatest[0]?.chapter_name
        );
        const estimatedTotal = storiesWithChapters.length * 50;
        const totalChapterPages = Math.ceil(estimatedTotal / MAX_URLS_PER_SITEMAP) || 1;

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // Sitemap chính (trang tĩnh + thể loại + truyện)
        xml += `  <sitemap>\n`;
        xml += `    <loc>${serverUrl}/api/seo/sitemap.xml</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `  </sitemap>\n`;

        // Các sitemap chapters
        for (let i = 1; i <= totalChapterPages; i++) {
            xml += `  <sitemap>\n`;
            xml += `    <loc>${serverUrl}/api/seo/sitemap-chapters-${i}.xml</loc>\n`;
            xml += `    <lastmod>${today}</lastmod>\n`;
            xml += `  </sitemap>\n`;
        }

        xml += `</sitemapindex>`;

        res.set("Content-Type", "application/xml");
        res.set("Cache-Control", "public, max-age=3600");
        res.status(200).send(xml);
    } catch (error) {
        console.error("Error generating sitemap index:", error);
        res.status(500).json({ message: "Error generating sitemap index" });
    }
};
