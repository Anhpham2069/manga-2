import React, { useState } from "react";
import NavBar from "../layout/Navbar";
import Footer from "../layout/footer";
import Sidebar from "./Sidebar";
import Content from "./ContentCpn";
import { useSelector, useDispatch } from "react-redux";
import { selectDarkMode } from "../layout/DarkModeSlice";
import { updateAvatar } from "../../redux/slice/authSlice";
import axios from "axios";

const AVATAR_STYLES = [
  "adventurer", "adventurer-neutral", "avataaars", "big-ears",
  "big-smile", "bottts", "fun-emoji", "lorelei",
  "micah", "miniavs", "personas", "pixel-art",
];

const BG_COLORS = [
  "b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf",
  "a3e4d7", "f9e79f", "f5b7b1", "aed6f1", "d5f5e3",
  "fadbd8", "e8daef", "d6eaf8", "fcf3cf", "d4efdf",
];

const generateAvatars = (count = 12) => {
  const avatars = [];
  for (let i = 0; i < count; i++) {
    const seed = Math.random().toString(36).substring(2, 10);
    const style = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
    const bg = BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];
    avatars.push(`https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&backgroundColor=${bg}`);
  }
  return avatars;
};

const UserComponent = () => {
  const [selectedItem, setSelectedItem] = useState(1);
  const isDarkModeEnable = useSelector(selectDarkMode);
  const user = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [avatarOptions, setAvatarOptions] = useState([]);
  const [savingAvatar, setSavingAvatar] = useState(false);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "A");

  const getMemberSince = () => {
    if (!user?.createdAt) return "N/A";
    return new Date(user.createdAt).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const openAvatarPicker = () => {
    setAvatarOptions(generateAvatars(12));
    setShowAvatarPicker(true);
  };

  const refreshAvatars = () => {
    setAvatarOptions(generateAvatars(12));
  };

  const handleSelectAvatar = async (avatarUrl) => {
    if (!user) return;
    setSavingAvatar(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/user/update-avatar/${user._id}`,
        { avatar: avatarUrl },
        { headers: { token: `Bearer ${user.accessToken}` } }
      );
      dispatch(updateAvatar(avatarUrl));
      setShowAvatarPicker(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingAvatar(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkModeEnable ? "bg-[#0f172a]" : "bg-gray-50"
        }`}
    >
      <NavBar />

      <div className="max-w-[90%] mx-auto mt-8 mb-12">
        {/* Profile Header Card */}
        <div
          className={`rounded-2xl overflow-hidden shadow-sm mb-6 transition-colors duration-300 ${isDarkModeEnable ? "bg-[#1e293b]" : "bg-white"
            }`}
        >
          {/* Banner */}
          <div
            className="h-36 relative"
            style={{
              background:
                "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-6 relative">
            {/* Avatar */}
            <div className="absolute -top-14 left-8">
              <div
                className="w-28 h-28 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white cursor-pointer group relative overflow-hidden"
                style={{
                  background: user?.avatar
                    ? "transparent"
                    : "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
                }}
                onClick={openAvatarPicker}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitial(user?.username)
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    Đổi avatar
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-20 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1
                  className={`text-2xl font-bold ${isDarkModeEnable ? "text-white" : "text-gray-800"
                    }`}
                >
                  {user?.username || "Guest"}
                </h1>
                <p
                  className={`text-sm mt-1 ${isDarkModeEnable ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  {user?.email}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {user?.admin && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-600">
                    Quản trị viên
                  </span>
                )}
                {user?.googleId && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-600">
                    Google
                  </span>
                )}
                <span
                  className={`text-xs ${isDarkModeEnable ? "text-gray-500" : "text-gray-400"
                    }`}
                >
                  Tham gia: {getMemberSince()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col laptop:flex-row gap-6">
          <Sidebar
            onItemClick={handleItemClick}
            activeItem={selectedItem}
            isDarkMode={isDarkModeEnable}
          />
          <div className="flex-1">
            <div
              className={`rounded-2xl p-6 shadow-sm transition-colors duration-300 ${isDarkModeEnable ? "bg-[#1e293b]" : "bg-white"
                }`}
            >
              <Content selectedItem={selectedItem} />
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
          onClick={() => setShowAvatarPicker(false)}
        >
          <div
            className={`w-full max-w-md rounded-2xl shadow-2xl p-6 ${isDarkModeEnable ? "bg-[#1e293b]" : "bg-white"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-lg font-bold ${isDarkModeEnable ? "text-white" : "text-gray-800"
                  }`}
              >
                Chọn Avatar
              </h3>
              <button
                onClick={refreshAvatars}
                className="px-3 py-1.5 text-xs font-medium bg-primary-color text-white rounded-lg hover:opacity-90 transition"
              >
                🎲 Random lại
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {avatarOptions.map((url, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAvatar(url)}
                  disabled={savingAvatar}
                  className={`rounded-xl border-2 p-1.5 transition-all hover:scale-105 hover:border-primary-color ${user?.avatar === url
                    ? "border-primary-color ring-2 ring-primary-color/30"
                    : isDarkModeEnable
                      ? "border-gray-600"
                      : "border-gray-200"
                    } ${savingAvatar ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
                >
                  <img
                    src={url}
                    alt={`avatar-${index}`}
                    className="w-full aspect-square rounded-lg"
                  />
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAvatarPicker(false)}
              className={`w-full mt-4 py-2 rounded-lg text-sm font-medium transition ${isDarkModeEnable
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UserComponent;