import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { loginUser, registerUser } from "../services/apiLoginRequest";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

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
    <div className="w-full h-screen flex justify-center items-center m-auto bg-bg_light">
      <div className=" w-5/6 h-[80%] flex justify-center items-center gap-2 border-2 bg-white shadow-lg rounded-md border-gray-400">
        <div className="w-4/6 h-full">
          <img
            className="h-full"
            src="https://wallpapercave.com/wp/wp4777307.jpg"
          ></img>
        </div>
        <div className="h-[90%] flex-1 text-base flex flex-col justify-between items-center gap-3">
          <p className="flex-1 font-mono text-4xl text-center uppercase">Đăng ký</p>
          <form
            onSubmit={handleSubmit}
            className="w-5/6 flex flex-col justify-center items-center gap-2"
          >
            <div className="mb-2 w-full">
              <span className="font-light">Tên</span>
              <input
                type="text"
                name="username"
                placeholder="Tên"
                className="border-b-2 border-bd-color outline-none w-full p-2 rounded-md text-lg font-medium"
  
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="mb-2 w-full">
              <span className="font-light">Tài khoản</span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border-b-2 border-bd-color outline-none w-full p-2 rounded-md text-lg font-medium"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-2 w-full">
              <span className="font-light">Mật khẩu</span>
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                className="border-b-2 border-bd-color outline-none w-full p-2 rounded-md text-lg font-medium"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-2 w-full">
              <span className="font-light">Xác nhận mật khẩu</span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                className="border-b-2 border-bd-color outline-none w-full p-2 rounded-md text-lg font-medium"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            
            <div className="w-full flex justify-center items-center">
              <button
                type="submit"
                className="bg-[#ff3860] text-white rounded-full w-3/5 p-2  "
              >
                Đăng ký
              </button>
            </div>
          </form>
          <p className="text-center ">
            Đã có tài khoản ?{" "}
            <Link to={'/login'} >
                <span className="cursor-pointer font-bold hover:text-primary-color">
                Đăng nhập ngay !
                </span>
            </Link>
          </p>
          <div className="w-full flex flex-col items-center">
            <button className="p-2  font-medium text-[#535a60] hover:text-red-500 border-[1px] border-bd-color w-[70%] rounded-full">
              <FontAwesomeIcon icon={faGoogle} /> Đăng nhập bằng Google
            </button>
            {/* <button className="p-2 bg-[#395697] hover:bg-[#536b9e] text-white border-[1px] border-bd-color w-[70%] rounded-full">
              <FontAwesomeIcon icon={faFacebook} /> Đăng nhập bằng Facebook
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
