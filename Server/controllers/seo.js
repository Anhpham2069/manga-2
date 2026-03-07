const SeoConfig = require("../models/SeoConfig");

exports.getSeoConfig = async (req, res) => {
    try {
        let seo = await SeoConfig.findOne();
        if (!seo) {
            // Nếu chưa có, tạo struct mặc định
            seo = await SeoConfig.create({});
        }
        res.status(200).json(seo);
    } catch (error) {
        console.error("Lỗi lấy cấu hình SEO:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.updateSeoConfig = async (req, res) => {
    try {
        const {
            siteTitle, siteDescription, keywords, ogImage, favicon,
            allStoriesTitle, allStoriesDesc, rankingTitle, rankingDesc,
            filterTitle, filterDesc, historyTitle, historyDesc,
            favoritesTitle, favoritesDesc, categoryTitle, categoryDesc
        } = req.body;

        // Luôn chỉ cho phép 1 record duy nhất 
        let seo = await SeoConfig.findOne();
        if (seo) {
            seo.siteTitle = siteTitle || seo.siteTitle;
            seo.siteDescription = siteDescription || seo.siteDescription;
            seo.keywords = keywords || seo.keywords;
            seo.allStoriesTitle = allStoriesTitle || seo.allStoriesTitle;
            seo.allStoriesDesc = allStoriesDesc || seo.allStoriesDesc;
            seo.rankingTitle = rankingTitle || seo.rankingTitle;
            seo.rankingDesc = rankingDesc || seo.rankingDesc;
            seo.filterTitle = filterTitle || seo.filterTitle;
            seo.filterDesc = filterDesc || seo.filterDesc;
            seo.historyTitle = historyTitle || seo.historyTitle;
            seo.historyDesc = historyDesc || seo.historyDesc;
            seo.favoritesTitle = favoritesTitle || seo.favoritesTitle;
            seo.favoritesDesc = favoritesDesc || seo.favoritesDesc;
            seo.categoryTitle = categoryTitle || seo.categoryTitle;
            seo.categoryDesc = categoryDesc || seo.categoryDesc;
            if (req.files && req.files.ogImage) {
                seo.ogImage = req.files.ogImage[0].path;
            } else if (ogImage !== undefined) {
                // Có thể truyền string trống để xóa ảnh, hoặc truyền url để giữ
                seo.ogImage = ogImage;
            }
            if (req.files && req.files.favicon) {
                seo.favicon = req.files.favicon[0].path;
            } else if (favicon !== undefined) {
                seo.favicon = favicon;
            }
            await seo.save();
        } else {
            const newSeoObj = {
                siteTitle, siteDescription, keywords,
                allStoriesTitle, allStoriesDesc, rankingTitle, rankingDesc,
                filterTitle, filterDesc, historyTitle, historyDesc,
                favoritesTitle, favoritesDesc, categoryTitle, categoryDesc
            };
            if (req.files) {
                if (req.files.ogImage) newSeoObj.ogImage = req.files.ogImage[0].path;
                if (req.files.favicon) newSeoObj.favicon = req.files.favicon[0].path;
            }
            seo = await SeoConfig.create(newSeoObj);
        }

        res.status(200).json(seo);
    } catch (error) {
        console.error("Lỗi cập nhật cấu hình SEO:", error);
        res.status(500).json({ message: "Lỗi lưu cấu hình" });
    }
};
