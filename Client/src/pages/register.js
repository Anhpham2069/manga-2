import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { loginUser, registerUser } from "../services/apiLoginRequest";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUserName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      username: username,
      email: email,
      password: password,
    };
    registerUser(user, dispatch, navigate);
  };

  return (
    <>
   <NavBar /> 
      <div className="w-full h-screen flex flex-col justify-center items-center gap-1 bg-bg_light">
        <div className=" phone:w-full tablet:w-[90%] h-[90%] flex phone:flex-col tablet:flex-row justify-center items-center gap-1 border-2 bg-white shadow-lg rounded-md border-gray-200">
          <div className="phone:hidden tablet:block relative w-4/6 h-full rounded-md">
            <img
              className="h-full"
              src="https://wallpapercave.com/wp/wp4777307.jpg"
            ></img>
          </div>
          <div className="h-full w-5/6 flex-1 py-2 text-base flex flex-col phone:justify-center tablet:justify-between items-center gap-2">
            <p className=" font-mono text-4xl text-center">
              Đăng ký
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
              <div className=" w-full">
                <span className="font-light">Tên</span>
                <input
                  type="text"
                  name="username"
                  className="border-b-2 border-bd-color outline-none w-full text-lg font-medium"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className=" w-full">
                <span className="font-light">Email</span>
                <input
                  type="email"
                  name="email"
                  className="border-b-2 border-bd-color outline-none w-full text-lg font-medium"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className=" w-full">
                <span className="font-light">Mật khẩu</span>
                <input
                  type="password"
                  name="password"
                  className="border-b-2 border-bd-color outline-none w-full text-lg font-medium"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className=" w-full">
                <span className="font-light">Xác nhận mật khẩu</span>
                <input
                  type="password"
                  name="confirmPassword"
                  className="border-b-2 border-bd-color outline-none w-full text-lg font-medium"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="w-full flex justify-center items-center">
                <button
                  type="submit"
                  className="bg-[#ff3860] text-white rounded-full phone:w-full tablet:w-3/5 p-1 my-3 "
                >
                  Đăng ký
                </button>
              </div>
            </form>
            <p className="text-center ">
              Đã có tài khoản ?{" "}
              <Link to={"/login"}>
                <span className="cursor-pointer font-bold hover:text-primary-color">
                  Đăng nhập ngay !
                </span>
              </Link>
            </p>
            <div className="w-full flex flex-col items-center">
              <button className="p-1 my-3  font-medium text-[#535a60] hover:text-red-500 border-[1px] border-bd-color phone:w-full tablet:w-[70%] rounded-full">
                <FontAwesomeIcon icon={faGoogle} /> Đăng nhập bằng Google
              </button>
              {/* <button className="p-1 bg-[#395697] hover:bg-[#536b9e] text-white border-[1px] border-bd-color w-[70%] rounded-full">
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

export default Register;
