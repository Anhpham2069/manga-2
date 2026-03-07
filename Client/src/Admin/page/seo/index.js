import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message, Card, Tabs } from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../../../components/layout/DarkModeSlice";

const SeoSettings = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [ogImageFile, setOgImageFile] = useState([]);
    const [faviconFile, setFaviconFile] = useState([]);

    // existing image URLs
    const [currentOgImage, setCurrentOgImage] = useState("");
    const [currentFavicon, setCurrentFavicon] = useState("");

    const user = useSelector((state) => state?.auth.login.currentUser);
    const isDarkModeEnable = useSelector(selectDarkMode);

    useEffect(() => {
        fetchSeoConfig();
    }, []);

    const fetchSeoConfig = async () => {
        try {
            const apiURL = process.env.REACT_APP_API_URL || "http://localhost:8000";
            const res = await axios.get(`${apiURL}/api/seo`);
            if (res.data) {
                form.setFieldsValue({
                    siteTitle: res.data.siteTitle,
                    siteDescription: res.data.siteDescription,
                    keywords: res.data.keywords,
                    allStoriesTitle: res.data.allStoriesTitle,
                    allStoriesDesc: res.data.allStoriesDesc,
                    rankingTitle: res.data.rankingTitle,
                    rankingDesc: res.data.rankingDesc,
                    filterTitle: res.data.filterTitle,
                    filterDesc: res.data.filterDesc,
                    historyTitle: res.data.historyTitle,
                    historyDesc: res.data.historyDesc,
                    favoritesTitle: res.data.favoritesTitle,
                    favoritesDesc: res.data.favoritesDesc,
                    categoryTitle: res.data.categoryTitle,
                    categoryDesc: res.data.categoryDesc,
                });
                setCurrentOgImage(res.data.ogImage);
                setCurrentFavicon(res.data.favicon);
            }
        } catch (error) {
            console.error("Lỗi lấy cấu hình:", error);
            message.error("Lỗi kết nối máy chủ");
        }
    };

    const handleSave = async (values) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("siteTitle", values.siteTitle || "");
        formData.append("siteDescription", values.siteDescription || "");
        formData.append("keywords", values.keywords || "");
        formData.append("allStoriesTitle", values.allStoriesTitle || "");
        formData.append("allStoriesDesc", values.allStoriesDesc || "");
        formData.append("rankingTitle", values.rankingTitle || "");
        formData.append("rankingDesc", values.rankingDesc || "");
        formData.append("filterTitle", values.filterTitle || "");
        formData.append("filterDesc", values.filterDesc || "");
        formData.append("historyTitle", values.historyTitle || "");
        formData.append("historyDesc", values.historyDesc || "");
        formData.append("favoritesTitle", values.favoritesTitle || "");
        formData.append("favoritesDesc", values.favoritesDesc || "");
        formData.append("categoryTitle", values.categoryTitle || "");
        formData.append("categoryDesc", values.categoryDesc || "");

        if (ogImageFile.length > 0) {
            formData.append("ogImage", ogImageFile[0].originFileObj);
        } else {
            formData.append("ogImage", currentOgImage || "");
        }

        if (faviconFile.length > 0) {
            formData.append("favicon", faviconFile[0].originFileObj);
        } else {
            formData.append("favicon", currentFavicon || "");
        }

        try {
            const apiURL = process.env.REACT_APP_API_URL || "http://localhost:8000";
            await axios.post(`${apiURL}/api/seo/update`, formData, {
                headers: {
                    "token": `Bearer ${user?.accessToken}`
                }
            });
            message.success("Lưu cấu hình thành công!");
            setOgImageFile([]);
            setFaviconFile([]);
            fetchSeoConfig(); // reload
        } catch (error) {
            message.error("Lưu cấu hình thất bại!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const tabItems = [
        {
            key: '1',
            label: 'Cơ Bản (Trang Chủ)',
            children: (
                <>
                    <Form.Item
                        label={<span className={isDarkModeEnable ? "text-gray-300" : ""}>Tiêu Đề Website (Site Title)</span>}
                        name="siteTitle"
                    >
                        <Input size="large" placeholder="Ví dụ: Manga Web - Đọc Truyện Tranh Online" className={isDarkModeEnable ? "bg-[#1e293b] text-white border-[#334155]" : ""} />
                    </Form.Item>
                    <Form.Item
                        label={<span className={isDarkModeEnable ? "text-gray-300" : ""}>Mô Tả Website (Site Description)</span>}
                        name="siteDescription"
                    >
                        <Input.TextArea rows={4} placeholder="Mô tả trang web để hiện trên kết quả tìm kiếm..." className={isDarkModeEnable ? "bg-[#1e293b] text-white border-[#334155]" : ""} />
                    </Form.Item>
                    <Form.Item
                        label={<span className={isDarkModeEnable ? "text-gray-300" : ""}>Từ Khóa SEO (Keywords)</span>}
                        name="keywords"
                    >
                        <Input size="large" placeholder="Mỗi từ khóa cách nhau bằng dấu phẩy. VD: truyen tranh, manga, comic" className={isDarkModeEnable ? "bg-[#1e293b] text-white border-[#334155]" : ""} />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                            <Form.Item label={<span className={isDarkModeEnable ? "text-gray-300" : ""}>Ảnh Thumbnail (OG Image lúc share FB/Zalo)</span>}>
                                <Upload
                                    beforeUpload={() => false}
                                    maxCount={1}
                                    fileList={ogImageFile}
                                    onChange={({ fileList }) => setOgImageFile(fileList)}
                                    accept="image/*"
                                >
                                    <Button icon={<UploadOutlined />}>Đổi ảnh Thumbnail</Button>
                                </Upload>
                                {currentOgImage && (
                                    <div className="mt-4">
                                        <p className="text-sm opacity-70 mb-2">Ảnh hiện tại:</p>
                                        <img src={currentOgImage} alt="OG" className="max-w-[300px] max-h-[150px] object-cover rounded shadow" />
                                    </div>
                                )}
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item label={<span className={isDarkModeEnable ? "text-gray-300" : ""}>Favicon (Icon nhỏ trên tab trình duyệt)</span>}>
                                <Upload
                                    beforeUpload={() => false}
                                    maxCount={1}
                                    fileList={faviconFile}
                                    onChange={({ fileList }) => setFaviconFile(fileList)}
                                    accept="image/*"
                                >
                                    <Button icon={<UploadOutlined />}>Đổi Favicon</Button>
                                </Upload>
                                {currentFavicon && (
                                    <div className="mt-4">
                                        <p className="text-sm opacity-70 mb-2">Icon hiện tại:</p>
                                        <img src={currentFavicon} alt="Favicon" className="max-w-[200px] max-h-[100px] object-cover rounded shadow" />
                                    </div>
                                )}
                            </Form.Item>
                        </div>
                    </div>
                </>
            ),
        },
        {
            key: '2',
            label: 'Tất Cả Truyện',
            children: (
                <>
                    <Form.Item label={<span className={isDarkModeEnable ? "text-gray-300" : ""}>Tiêu Đề (Title)</span>} name="allStoriesTitle">
                        <Input size="large" className={isDarkModeEnable ? "bg-[#1e293b] text-white border-[#334155]" : ""} />
                    </Form.Item>
                    <Form.Item label={<span className={isDarkModeEnable ? "text-gray-300" : ""}>Mô tả (Description)</span>} name="allStoriesDesc">
                        <Input.TextArea rows={4} className={isDarkModeEnable ? "bg-[#1e293b] text-white border-[#334155]" : ""} />
                    </Form.Item>
                </>
            ),
        },
        {
            key: '3',
            label: 'Xếp Hạng',
            children: (
                <>
                    <Form.Item label={<span className={isDarkModeEnable ? "text-gray-300" : ""}>Tiêu Đề (Title)</span>} name="rankingTitle">
                        <Input size="large" className={isDarkModeEnable ? "bg-[#1e293b] text-white border-[#334155]" : ""} />
                    </Form.Item>
                    <Form.Item label={<span className={isDarkModeEnable ? "text-gray-300" : ""}>Mô tả (Description)</span>} name="rankingDesc">
                        <Input.TextArea rows={4} className={isDarkModeEnable ? "bg-[#1e293b] text-white border-[#334155]" : ""} />
                    </Form.Item>
                </>
            ),
        },
        {
            key: '4',
            label: 'Lọc Truyện',
            children: (
                <>
                    <Form.Item label={<span className={isDarkModeEnable ? "text-gray-300" : ""}>Tiêu Đề (Title)</span>} name="filterTitle">
                        <Input size="large" className={isDarkModeEnable ? "bg-[#1e293b] text-white border-[#334155]" : ""} />
                    </Form.Item>
                    <Form.Item label={<span className={isDarkModeEnable ? "text-gray-300" : ""}>Mô tả (Description)</span>} name="filterDesc">
                        <Input.TextArea rows={4} className={isDarkModeEnable ? "bg-[#1e293b] text-white border-[#334155]" : ""} />
                    </Form.Item>
                </>
            ),
        },
        {
            key: '5',
            label: 'Lịch Sử / Yêu Thích',
            children: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className={`font-semibold mb-3 ${isDarkModeEnable ? "text-white" : "text-gray-700"}`}>Lịch Sử Đọc</h3>
                        <Form.Item label={<span className={isDarkModeEnable ? "text-gray-300" : ""}>Tiêu Đề</span>} name="historyTitle">
                            <Input className={isDarkModeEnable ? "bg-[#1e293b] text-white border-[#334155]" : ""} />
                        </Form.Item>
                        <Form.Item label={<span className={isDarkModeEnable ? "text-gray-300" : ""}>Mô tả</span>} name="historyDesc">
                            <Input.TextArea rows={3} className={isDarkModeEnable ? "bg-[#1e293b] text-white border-[#334155]" : ""} />
                        </Form.Item>
                    </div>
                    <div>
                        <h3 className={`font-semibold mb-3 ${isDarkModeEnable ? "text-white" : "text-gray-700"}`}>Yêu Thích</h3>
                        <Form.Item label={<span className={isDarkModeEnable ? "text-gray-300" : ""}>Tiêu Đề</span>} name="favoritesTitle">
                            <Input className={isDarkModeEnable ? "bg-[#1e293b] text-white border-[#334155]" : ""} />
                        </Form.Item>
                        <Form.Item label={<span className={isDarkModeEnable ? "text-gray-300" : ""}>Mô tả</span>} name="favoritesDesc">
                            <Input.TextArea rows={3} className={isDarkModeEnable ? "bg-[#1e293b] text-white border-[#334155]" : ""} />
                        </Form.Item>
                    </div>
                </div>
            ),
        },
        {
            key: '6',
            label: 'Thể Loại (Category)',
            children: (
                <>
                    <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                        <b>Mẹo:</b> Sử dụng nhãn <code>{"[category]"}</code> trong nội dung để hệ thống tự động thay thế bằng Tên Thể Loại khi người dùng truy cập.
                    </div>
                    <Form.Item label={<span className={isDarkModeEnable ? "text-gray-300" : ""}>Tiêu Đề (Title)</span>} name="categoryTitle">
                        <Input size="large" className={isDarkModeEnable ? "bg-[#1e293b] text-white border-[#334155]" : ""} />
                    </Form.Item>
                    <Form.Item label={<span className={isDarkModeEnable ? "text-gray-300" : ""}>Mô tả (Description)</span>} name="categoryDesc">
                        <Input.TextArea rows={4} className={isDarkModeEnable ? "bg-[#1e293b] text-white border-[#334155]" : ""} />
                    </Form.Item>
                </>
            ),
        }
    ];

    return (
        <div className={`p-6 md:p-8 rounded-xl min-h-screen ${isDarkModeEnable ? "bg-[#1e293b]" : "bg-white"}`}>
            <div className="mb-6">
                <h2 className={`text-2xl font-bold ${isDarkModeEnable ? "text-white" : "text-gray-800"}`}>Cấu Hình SEO Mở Rộng</h2>
                <p className={isDarkModeEnable ? "text-gray-400" : "text-gray-500"}>Quản lý thẻ Tiêu đề, Mô tả cho nhiều trang khác nhau nhằm tối ưu SEO.</p>
            </div>

            <Card className={isDarkModeEnable ? "bg-[#0f172a] border-[#334155] text-white" : ""}>
                <Form layout="vertical" form={form} onFinish={handleSave}>
                    <Tabs defaultActiveKey="1" items={tabItems} className={isDarkModeEnable ? "custom-dark-tabs" : ""} />

                    <div className={`mt-6 pt-6 flex justify-end ${isDarkModeEnable ? "border-t border-[#334155]" : "border-t border-gray-200"}`}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            size="large"
                            loading={loading}
                            className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                        >Lưu Cấu Hình</Button>
                    </div>
                </Form>
            </Card>
        </div>
    )
}
export default SeoSettings;
