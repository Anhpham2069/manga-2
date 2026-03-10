const axios = require("axios");
const Genre = require("../models/genres");

const SITE_URL = "https://manga-2-client.vercel.app";
const OTRUYEN_API = "https://otruyenapi.com/v1/api";

// Các trang tĩnh
const staticPages = [
    { loc: "/", changefreq: "daily", priority: "1.0" },
    { loc: "/all-stories", changefreq: "daily", priority: "0.9" },
    { loc: "/ranking", changefreq: "daily", priority: "0.8" },
    { loc: "/filter", changefreq: "weekly", priority: "0.7" },
    { loc: "/contact", changefreq: "monthly", priority: "0.4" },
    { loc: "/login", changefreq: "monthly", priority: "0.3" },
    { loc: "/register", changefreq: "monthly", priority: "0.3" },
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
 * GET /api/seo/sitemap.xml
 * Generate sitemap XML động
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
 * GET /api/seo/sitemap-index.xml
 * Sitemap index nếu cần chia nhỏ
 */
exports.generateSitemapIndex = async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0];
        const serverUrl = `${req.protocol}://${req.get("host")}`;

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        xml += `  <sitemap>\n`;
        xml += `    <loc>${serverUrl}/api/seo/sitemap.xml</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `  </sitemap>\n`;
        xml += `</sitemapindex>`;

        res.set("Content-Type", "application/xml");
        res.set("Cache-Control", "public, max-age=3600");
        res.status(200).send(xml);
    } catch (error) {
        console.error("Error generating sitemap index:", error);
        res.status(500).json({ message: "Error generating sitemap index" });
    }
};
