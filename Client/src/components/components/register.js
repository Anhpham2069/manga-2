import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { registerUser } from "../../services/apiRequest";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const  dispatch = useDispatch()
  const navigate = useNavigate()
  //state
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
    registerUser(user,dispatch,navigate)
  };

  return (
    <div className="text-base">
      <form onSubmit={handleSubmit}>
        <span className="font-medium">Tên</span>
        <input
          type="text"
          name="username"
          placeholder="Tên"
          className="mb-3 border-[1px] border-bd-color outline-none w-full p-2 rounded-md"
          onChange={(e) => setUserName(e.target.value)}
        />

        <span className="font-medium">Tài khoản</span>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="mb-3 border-[1px] border-bd-color outline-none w-full p-2 rounded-md"
          onChange={(e) => setEmail(e.target.value)}
        />

        <span className="font-medium">Mật khẩu</span>
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          className="border-[1px] border-bd-color outline-none w-full p-2 rounded-md"
          onChange={(e) => setPassword(e.target.value)}
        />

        <span className="font-medium">Xác nhận mật khẩu</span>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Xác nhận mật khẩu"
          className="my-3 border-[1px] border-bd-color outline-none w-full p-2 rounded-md"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-[#ff3860] text-white rounded-md w-full p-2 my-3"
        >
          Đăng ký
        </button>
      </form>

      <p className="text-center ">
        Bạn đã có tài khoản ?{" "}
        <span className="cursor-pointer font-medium">Đăng nhập ngay !</span>
      </p>

      <div className="w-full flex flex-col items-center">
        <button className="p-2 my-3  font-medium text-[#535a60] hover:text-red-500   border-[1px] border-bd-color w-[70%] rounded-full">
          <FontAwesomeIcon icon={faGoogle} /> Đăng ký bằng Google
        </button>

        <button className="p-2  bg-[#395697] hover:bg-[#536b9e] text-white border-[1px] border-bd-color w-[70%] rounded-full">
          <FontAwesomeIcon icon={faFacebook} /> Đăng ký bằng Facebook
        </button>
      </div>
    </div>
  );
};

export default Register;
