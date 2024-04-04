import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { loginUser } from "../services/apiLoginRequest";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import { Helmet } from "react-helmet";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      username: userName,
      password: password,
    };
    loginUser(user, dispatch, navigate);
  };

  return (
    <>
    <Helmet>
        <title>Đăng nhập</title>
        <meta
          name="description"
          content="Đăng nhập để khám phá những câu chuyện nổi bật mới nhất trên Đọc truyện 5s. Đọc những câu chuyện mới, tìm những câu chuyện đã hoàn thành và khám phá những bản phát hành sắp tới."
        />
      </Helmet>
      <NavBar />
      <div className="w-full h-screen flex flex-col justify-center items-center gap-2 bg-bg_light">
        <div className=" phone:w-full tablet:w-5/6 h-[90%] flex phone:flex-col tablet:flex-row justify-center items-center gap-2 border-2 bg-white shadow-lg rounded-md border-gray-200">
          <div className="phone:hidden tablet:block relative w-4/6 h-full rounded-md">
            <img
              className="h-full rounded-md"
              src="https://wallpapercave.com/wp/wp4777307.jpg"
            ></img>
            <div className="bg-white w-20 h-20 absolute z-20 top-2 left-3 rounded-full shadow-inner cursor-pointer hover:bg_hover ">
              <Link to={"/"}>
                <img
                  src="https://www.pngall.com/wp-content/uploads/13/Anime-Logo-PNG-HD-Image.png"
                  className=""
                ></img>
              </Link>
            </div>
          </div>
          <div className="h-[90%] w-[90%] flex-1 text-base flex flex-col phone:justify-center tablet:justify-between items-center gap-5">
            <p className="tablet:flex-1 font-mono text-4xl text-center">
              Login
            </p>
            <div className=" w-20 h-20 ">
              <img
                src="https://www.pngall.com/wp-content/uploads/13/Anime-Logo-PNG-HD-Image.png"
                className=""
              ></img>
            </div>

            <form
              onSubmit={handleSubmit}
              className="phone:w-full tablet:w-5/6 flex flex-col justify-center items-center"
            >
              <div className="mb-4 w-full">
                <span className="font-light">Tài khoản</span>
                <input
                  type="text"
                  name="email"
                  onChange={(e) => setUserName(e.target.value)}
                  className="border-b-2 border-bd-color outline-none w-full p-2 text-lg font-medium"
                />
              </div>
              <div className="mb-4 w-full">
                <span className="font-light">Mật khẩu</span>
                <input
                  name="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-b-2 border-bd-color outline-none w-full p-2 text-lg font-medium"
                />
              </div>
              <div className="w-full">
                <p className="text-end">Quên mật khẩu ?</p>
              </div>
              <div className="w-full flex justify-center items-center">
                <button
                  type="submit"
                  className="bg-[#ff3860] text-white rounded-full phone:w-full tablet:w-3/5 p-2 my-3 "
                >
                  Đăng nhập
                </button>
              </div>
            </form>
            <p className="text-center ">
              Không có tài khoản ?{" "}
              <Link to={"/register"}>
                <span className="cursor-pointer font-bold hover:text-primary-color">
                  Đăng kí ngay !
                </span>
              </Link>
            </p>
            <div className="w-full flex flex-col items-center">
              <button className="p-2 my-3  font-medium text-[#535a60] hover:text-red-500 border-[1px] border-bd-color phone:w-full tablet:w-[70%] rounded-full">
                <FontAwesomeIcon icon={faGoogle} /> Đăng nhập bằng Google
              </button>
              {/* <button className="p-2 bg-[#395697] hover:bg-[#536b9e] text-white border-[1px] border-bd-color w-[70%] rounded-full">
                <FontAwesomeIcon icon={faFacebook} /> Đăng nhập bằng Facebook
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
