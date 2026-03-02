import React, { useState } from "react";
import axios from "axios";
import NavBar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../components/layout/DarkModeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faPaperPlane,
  faCommentDots,
  faCheckCircle,
  faHeadset,
  faBug,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";

const ContactUs = () => {
  const isDark = useSelector(selectDarkMode);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const validate = () => {
    let newErrors = {};
    let isValid = true;
    if (!formData.name.trim()) { newErrors.name = "Vui lòng nhập tên của bạn"; isValid = false; }
    if (!formData.email.trim()) { newErrors.email = "Vui lòng nhập email"; isValid = false; }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = "Email không hợp lệ"; isValid = false; }
    if (!formData.message.trim()) { newErrors.message = "Vui lòng nhập nội dung"; isValid = false; }
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      setSuccess("");
      await axios.post(`${process.env.REACT_APP_API_URL}/api/contact`, formData);
      setSuccess("Gửi thành công! Chúng tôi sẽ phản hồi sớm nhất.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full py-3 px-4 rounded-xl text-sm outline-none transition-all duration-200 ${isDark
      ? "bg-[#0f172a] border-[#334155] text-gray-200 placeholder-gray-500 focus:border-blue-500"
      : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400 focus:border-primary-color focus:bg-white"
    } border ${errors[field] ? "border-red-500 ring-1 ring-red-500/30" : ""}`;

  const infoCards = [
    { icon: faHeadset, title: "Hỗ trợ", desc: "Giải đáp thắc mắc về web" },
    { icon: faBug, title: "Báo lỗi", desc: "Thông báo lỗi truyện, ảnh" },
    { icon: faLightbulb, title: "Góp ý", desc: "Đề xuất tính năng mới" },
  ];

  return (
    <>
      <Helmet>
        <title>Liên hệ - DocTruyen5s</title>
        <meta name="description" content="Liên hệ với DocTruyen5s để gửi phản hồi, góp ý hoặc báo lỗi. Chúng tôi luôn sẵn sàng lắng nghe bạn." />
        <meta property="og:title" content="Liên hệ - DocTruyen5s" />
        <meta property="og:description" content="Liên hệ với DocTruyen5s để gửi phản hồi, góp ý hoặc báo lỗi." />
        <meta property="og:type" content="website" />
      </Helmet>
      <NavBar />

      <div className={`min-h-screen py-10 ${isDark ? "bg-bg_dark" : "bg-bg_light"}`}>
        <div className="max-w-5xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-10">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${isDark ? "bg-blue-600/20" : "bg-primary-color/10"}`}>
              <FontAwesomeIcon icon={faEnvelope} className={`text-2xl ${isDark ? "text-blue-400" : "text-primary-color"}`} />
            </div>
            <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
              Liên hệ với chúng tôi
            </h1>
            <p className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {infoCards.map((card, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl text-center transition-all hover:scale-[1.02] ${isDark
                    ? "bg-[#1e293b] border border-[#334155]"
                    : "bg-white border border-gray-100 shadow-sm"
                  }`}
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${isDark ? "bg-blue-600/20" : "bg-primary-color/10"
                  }`}>
                  <FontAwesomeIcon icon={card.icon} className={isDark ? "text-blue-400" : "text-primary-color"} />
                </div>
                <h3 className={`font-bold text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>{card.title}</h3>
                <p className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className={`max-w-2xl mx-auto rounded-2xl p-8 ${isDark ? "bg-[#1e293b] border border-[#334155]" : "bg-white border border-gray-100 shadow-lg shadow-gray-100/50"
            }`}>

            {/* Success message */}
            {success && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-lg" />
                <p className="text-green-700 text-sm font-medium">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  <FontAwesomeIcon icon={faUser} className="text-xs" />
                  Họ và tên
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên của bạn"
                  className={inputClass("name")}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
                  Địa chỉ email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className={inputClass("email")}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
              </div>

              {/* Message */}
              <div>
                <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  <FontAwesomeIcon icon={faCommentDots} className="text-xs" />
                  Nội dung
                </label>
                <textarea
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Viết nội dung bạn muốn gửi..."
                  className={`${inputClass("message")} resize-none`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1.5">{errors.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2
                  ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary-color hover:opacity-90 hover:shadow-lg hover:shadow-primary-color/20 active:scale-[0.98]"
                  }`}
              >
                <FontAwesomeIcon icon={faPaperPlane} className={loading ? "" : "animate-pulse"} />
                {loading ? "Đang gửi..." : "Gửi liên hệ"}
              </button>
            </form>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;
