import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { registerUser } from "../services/apiLoginRequest";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import { Helmet } from "react-helmet";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasError = false;
    let newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!username.trim()) {
      newErrors.username = "Vui lòng nhập tên tài khoản";
      hasError = true;
    }

    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email";
      hasError = true;
    }

    if (!password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
      hasError = true;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    const user = {
      username,
      email,
      password,
    };

    registerUser(user, dispatch, navigate);
  };

  return (
    <>
      <Helmet>
        <title>Đăng ký</title>
        <meta
          name="description"
          content="Đăng ký để khám phá những câu chuyện nổi bật mới nhất."
        />
      </Helmet>

      <NavBar />

      <div className="min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <img
              src="https://www.pngall.com/wp-content/uploads/13/Anime-Logo-PNG-HD-Image.png"
              alt="logo"
              className="w-20 mb-3"
            />
            <h2 className="text-3xl font-bold text-gray-800">
              Đăng ký
            </h2>
            <p className="text-gray-500 text-sm">
              Tạo tài khoản mới để bắt đầu 🚀
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label className="text-sm text-gray-600">
                Tên tài khoản
              </label>
              <input
                type="text"
                onChange={(e) => {
                  setUserName(e.target.value);
                  setErrors({ ...errors, username: "" });
                }}
                className={`w-full mt-1 px-4 py-2 border rounded-lg outline-none transition
                  ${
                    errors.username
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-2 focus:ring-purple-400"
                  }
                `}
                placeholder="Nhập tên tài khoản..."
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">
                Email
              </label>
              <input
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: "" });
                }}
                className={`w-full mt-1 px-4 py-2 border rounded-lg outline-none transition
                  ${
                    errors.email
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-2 focus:ring-purple-400"
                  }
                `}
                placeholder="Nhập email..."
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-600">
                Mật khẩu
              </label>
              <input
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                }}
                className={`w-full mt-1 px-4 py-2 border rounded-lg outline-none transition
                  ${
                    errors.password
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-2 focus:ring-purple-400"
                  }
                `}
                placeholder="Nhập mật khẩu..."
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm text-gray-600">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors({ ...errors, confirmPassword: "" });
                }}
                className={`w-full mt-1 px-4 py-2 border rounded-lg outline-none transition
                  ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-2 focus:ring-purple-400"
                  }
                `}
                placeholder="Nhập lại mật khẩu..."
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#ff3860] hover:bg-[#ff1f4b] text-white py-2 rounded-lg font-semibold transition duration-300 shadow-md"
            >
              Đăng ký
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t"></div>
            <span className="px-3 text-gray-400 text-sm">Hoặc</span>
            <div className="flex-1 border-t"></div>
          </div>

          {/* Google */}
          <button className="w-full border rounded-lg py-2 flex justify-center items-center gap-2 hover:bg-gray-50 transition">
            <FontAwesomeIcon icon={faGoogle} className="text-red-500" />
            <span>Đăng ký bằng Google</span>
          </button>

          {/* Login */}
          <p className="text-center mt-6 text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-purple-600 font-semibold hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default Register;
