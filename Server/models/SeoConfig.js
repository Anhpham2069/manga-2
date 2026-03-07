const mongoose = require("mongoose");

const seoConfigSchema = new mongoose.Schema(
    {
        siteTitle: { type: String, default: "Manga Web - Đọc Truyện Tranh Online" },
        siteDescription: { type: String, default: "Website đọc truyện tranh online miễn phí cập nhật liên tục." },
        keywords: { type: String, default: "truyen tranh, manga, doc truyen tranh online" },
        ogImage: { type: String, default: "" },
        favicon: { type: String, default: "" },

        // Tất Cả Truyện
        allStoriesTitle: { type: String, default: "Tất Cả Truyện Tranh - Manga Web" },
        allStoriesDesc: { type: String, default: "Danh sách tất cả truyện tranh đầy đủ nhất." },

        // Xếp Hạng
        rankingTitle: { type: String, default: "Bảng Xếp Hạng Truyện Tranh - Manga Web" },
        rankingDesc: { type: String, default: "Top các truyện tranh được yêu thích và đọc nhiều nhất." },

        // Lọc Truyện
        filterTitle: { type: String, default: "Lọc Truyện Tranh Nâng Cao - Manga Web" },
        filterDesc: { type: String, default: "Truy tìm truyện tranh theo nhiều thể loại, tình trạng." },

        // Lịch Sử
        historyTitle: { type: String, default: "Lịch Sử Đọc Truyện - Manga Web" },
        historyDesc: { type: String, default: "Xem lại những truyện tranh bạn đã đọc." },

        // Yêu Thích
        favoritesTitle: { type: String, default: "Truyện Tranh Yêu Thích - Manga Web" },
        favoritesDesc: { type: String, default: "Danh sách các truyện tranh bạn đang theo dõi." },

        // Thể loại (có biến động)
        categoryTitle: { type: String, default: "Truyện Tranh Thể Loại [category] - Manga Web" },
        categoryDesc: { type: String, default: "Danh sách truyện tranh thể loại [category] siêu hay và miễn phí." },
    },
    { timestamps: true }
);

const SeoConfig = mongoose.model("SeoConfig", seoConfigSchema);

module.exports = SeoConfig;
