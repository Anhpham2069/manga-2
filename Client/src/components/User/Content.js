import React, { useState } from "react";
import { useSelector } from "react-redux";
import { changePasswordUser } from "../../services/apiLoginRequest";
import { message } from "antd";
import { selectDarkMode } from "../layout/DarkModeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faCalendar,
  faShieldHalved,
  faKey,
  faEye,
  faEyeSlash,
  faLink,
} from "@fortawesome/free-solid-svg-icons";

// ======= Text Input Component =======
const TextInput = ({ label, value, onChange, type = "text", disabled, icon, isDarkMode, suffix }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="mb-4">
      <label
        className={`block text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
          >
            <FontAwesomeIcon icon={icon} className="text-sm" />
          </span>
        )}
        <input
          className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 ${icon ? "pl-10" : ""
            } ${suffix ? "pr-20" : ""} ${disabled
              ? isDarkMode
                ? "bg-[#0f172a] text-gray-500 border border-[#1e293b] cursor-not-allowed"
                : "bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed"
              : isDarkMode
                ? "bg-[#0f172a] text-gray-200 border border-[#334155] focus:border-blue-500"
                : "bg-gray-50 text-gray-700 border border-gray-200 focus:border-blue-400"
            }`}
          value={value || ""}
          onChange={onChange}
          type={isPassword && !showPassword ? "password" : "text"}
          disabled={disabled}
        />
        {isPassword && value && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
              }`}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-sm" />
          </button>
        )}
        {suffix && (
          <span
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium px-2 py-1 rounded-md ${isDarkMode ? "bg-[#334155] text-gray-400" : "bg-gray-200 text-gray-500"
              }`}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

// ======= Profile Component =======
const Profile = () => {
  const user = useSelector((state) => state?.auth.login.currentUser);
  const isDarkMode = useSelector(selectDarkMode);

  const getMemberSince = () => {
    if (!user?.createdAt) return "N/A";
    return new Date(user.createdAt).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="w-full">
      <h2
        className={`text-xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"
          }`}
      >
        Thông tin tài khoản
      </h2>

      <div className="grid grid-cols-1 laptop:grid-cols-2 gap-x-6">
        <TextInput
          label="Tên hiển thị"
          value={user?.username}
          icon={faUser}
          disabled
          isDarkMode={isDarkMode}
        />
        <TextInput
          label="Địa chỉ Email"
          value={user?.email}
          icon={faEnvelope}
          disabled
          isDarkMode={isDarkMode}
        />
        <TextInput
          label="Google ID"
          value={user?.googleId || "Chưa liên kết"}
          icon={faLink}
          disabled
          isDarkMode={isDarkMode}
        />
        <TextInput
          label="Ngày tham gia"
          value={getMemberSince()}
          icon={faCalendar}
          disabled
          isDarkMode={isDarkMode}
        />
        <TextInput
          label="Vai trò"
          value={user?.admin ? "Quản trị viên" : "Thành viên"}
          icon={faShieldHalved}
          disabled
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

// ======= Change Password Component =======
const ChangePassWord = () => {
  const user = useSelector((state) => state?.auth.login.currentUser);
  const isDarkMode = useSelector(selectDarkMode);

  const [passWord, setPassWord] = useState("");
  const [newPassWord, setNewPassWord] = useState("");
  const [confirmPassWord, setConfirmPassWord] = useState("");
  const [errors, setErrors] = useState({});

  const handleChangePassword = async () => {
    let newErrors = {};
    let hasError = false;

    if (!passWord.trim()) {
      newErrors.passWord = "Vui lòng nhập mật khẩu hiện tại";
      hasError = true;
    }
    if (!newPassWord.trim()) {
      newErrors.newPassWord = "Vui lòng nhập mật khẩu mới";
      hasError = true;
    } else if (newPassWord.length < 6) {
      newErrors.newPassWord = "Mật khẩu mới phải ít nhất 6 ký tự";
      hasError = true;
    }
    if (!confirmPassWord.trim()) {
      newErrors.confirmPassWord = "Vui lòng xác nhận mật khẩu mới";
      hasError = true;
    } else if (newPassWord !== confirmPassWord) {
      newErrors.confirmPassWord = "Mật khẩu xác nhận không khớp";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    try {
      await changePasswordUser(user?._id, passWord, newPassWord);
      message.success("Đổi mật khẩu thành công!");
      setPassWord("");
      setNewPassWord("");
      setConfirmPassWord("");
      setErrors({});
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Mật khẩu hiện tại không đúng"
      );
    }
  };

  return (
    <div className="w-full max-w-lg">
      <h2
        className={`text-xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"
          }`}
      >
        Đổi mật khẩu
      </h2>

      <div>
        <TextInput
          label="Mật khẩu hiện tại"
          value={passWord}
          onChange={(e) => {
            setPassWord(e.target.value);
            setErrors({ ...errors, passWord: "" });
          }}
          type="password"
          icon={faKey}
          isDarkMode={isDarkMode}
        />
        {errors.passWord && (
          <p className="text-red-500 text-xs -mt-2 mb-3 ml-1">{errors.passWord}</p>
        )}

        <TextInput
          label="Mật khẩu mới"
          value={newPassWord}
          onChange={(e) => {
            setNewPassWord(e.target.value);
            setErrors({ ...errors, newPassWord: "" });
          }}
          type="password"
          icon={faKey}
          isDarkMode={isDarkMode}
        />
        {errors.newPassWord && (
          <p className="text-red-500 text-xs -mt-2 mb-3 ml-1">{errors.newPassWord}</p>
        )}

        <TextInput
          label="Xác nhận mật khẩu mới"
          value={confirmPassWord}
          onChange={(e) => {
            setConfirmPassWord(e.target.value);
            setErrors({ ...errors, confirmPassWord: "" });
          }}
          type="password"
          icon={faKey}
          isDarkMode={isDarkMode}
        />
        {errors.confirmPassWord && (
          <p className="text-red-500 text-xs -mt-2 mb-3 ml-1">{errors.confirmPassWord}</p>
        )}
      </div>

      <button
        onClick={handleChangePassword}
        className="mt-2 px-6 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md"
      >
        Cập nhật mật khẩu
      </button>
    </div>
  );
};

// ======= Gift Component =======
const Gift = () => {
  const isDarkMode = useSelector(selectDarkMode);

  return (
    <div className="w-full">
      <h2
        className={`text-xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"
          }`}
      >
        Đổi thẻ quà tặng
      </h2>

      <div className="grid grid-cols-1 laptop:grid-cols-3 gap-4 mb-6">
        <TextInput label="COIN" isDarkMode={isDarkMode} suffix="coin" />
        <TextInput label="Loại thẻ" isDarkMode={isDarkMode} />
        <TextInput label="Tổng thanh toán" isDarkMode={isDarkMode} suffix="VNĐ" />
      </div>

      <button className="px-6 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md">
        Đổi thẻ
      </button>

      <h3
        className={`text-lg font-bold mt-8 mb-4 ${isDarkMode ? "text-white" : "text-gray-800"
          }`}
      >
        Danh sách thẻ
      </h3>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr
              className={
                isDarkMode ? "bg-[#0f172a] text-gray-400" : "bg-gray-50 text-gray-600"
              }
            >
              <th className="text-left px-4 py-3 font-semibold">#</th>
              <th className="text-left px-4 py-3 font-semibold">Loại</th>
              <th className="text-left px-4 py-3 font-semibold">Code</th>
              <th className="text-left px-4 py-3 font-semibold">Serial</th>
              <th className="text-left px-4 py-3 font-semibold">Ngày</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={5}
                className={`text-center px-4 py-8 ${isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
              >
                Chưa có dữ liệu
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { Profile, ChangePassWord, Gift };
