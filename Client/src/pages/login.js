import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { loginUser, googleLogin } from "../services/apiLoginRequest";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import { Helmet } from "react-helmet";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [loginError, setLoginError] = useState("");

  const [errors, setErrors] = useState({
    userName: "",
    password: "",
  });




  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoginError("");

    let hasError = false;
    let newErrors = { userName: "", password: "" };

    if (!userName || userName.trim() === "") {
      newErrors.userName = "Vui lòng nhập tài khoản";
      hasError = true;
    }

    if (!password || password.trim() === "") {
      newErrors.password = "Vui lòng nhập mật khẩu";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    try {
      const user = {
        username: userName,
        password: password,
      };

      await loginUser(user, dispatch, navigate);
    } catch (err) {
      setLoginError("Sai tài khoản hoặc mật khẩu");
    }
  };


  return (
    <>
      <Helmet>
        <title>Đăng nhập</title>
        <meta
          name="description"
          content="Đăng nhập để khám phá những câu chuyện nổi bật mới nhất."
        />
      </Helmet>

      <NavBar />

      <div className="min-h-screen p-4 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 px-4">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <img
              src="https://www.pngall.com/wp-content/uploads/13/Anime-Logo-PNG-HD-Image.png"
              alt="logo"
              className="w-20 mb-3"
            />
            <h2 className="text-3xl font-bold text-gray-800">Đăng nhập</h2>
            <p className="text-gray-500 text-sm">
              Chào mừng bạn quay trở lại 👋
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="text-sm text-gray-600">Tài khoản</label>
              <input
                type="text"
                onChange={(e) => {
                  setUserName(e.target.value);
                  setErrors({ ...errors, userName: "" });
                }}
                className={`w-full mt-1 px-4 py-2 border rounded-lg outline-none transition
              ${errors.userName ? "border-red-500 focus:ring-red-400" : "focus:ring-2 focus:ring-purple-400"}
            `}
                placeholder="Nhập tài khoản..."
              />

              {errors.userName && (
                <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
              )}

            </div>

            <div>
              <label className="text-sm text-gray-600">Mật khẩu</label>
              <input
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                }}
                className={`w-full mt-1 px-4 py-2 border rounded-lg outline-none transition
              ${errors.password ? "border-red-500 focus:ring-red-400" : "focus:ring-2 focus:ring-purple-400"}
            `}
                placeholder="Nhập mật khẩu..."
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}

            </div>

            <div className="text-right text-sm text-gray-500 hover:text-purple-600 cursor-pointer">
              Quên mật khẩu?
            </div>
            {loginError && (
              <p className="text-red-500 text-sm text-center mb-2">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#ff3860] hover:bg-[#ff1f4b] text-white py-2 rounded-lg font-semibold transition duration-300 shadow-md"
            >
              Đăng nhập
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t"></div>
            <span className="px-3 text-gray-400 text-sm">Hoặc</span>
            <div className="flex-1 border-t"></div>
          </div>

          {/* Social Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                googleLogin(credentialResponse.credential, dispatch, navigate)
                  .catch(() => setLoginError("Đăng nhập Google thất bại"));
              }}
              onError={() => {
                setLoginError("Đăng nhập Google thất bại");
              }}
              text="signin_with"
              shape="rectangular"
              width="350"
            />
          </div>

          {/* Register */}
          <p className="text-center mt-6 text-sm text-gray-600">
            Không có tài khoản?{" "}
            <Link
              to="/register"
              className="text-purple-600 font-semibold hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>

        </div>
      </div>

      <Footer />
    </>

  );
};

export default Login;
