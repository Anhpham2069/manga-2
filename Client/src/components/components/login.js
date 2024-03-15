import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook,faGoogle } from '@fortawesome/free-brands-svg-icons'
import { loginUser } from '../../services/apiLoginRequest';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Login = () => {

const  dispatch = useDispatch()
const navigate = useNavigate()

const [userName,setUserName] = useState()
const [password,setPassword] = useState()

const handleSubmit = (e) =>{
  e.preventDefault()
  const user = {
    username: userName,
    password: password
  }
  loginUser(user,dispatch,navigate)
}

  return (
    <div className='text-base'>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <span className='font-medium'>Tài khoản</span>
          <input
            type='text'
            placeholder='Email'
            name='email'
            onChange={(e)=>setUserName(e.target.value)}
            className='border-[1px] border-bd-color outline-none w-full p-2 rounded-md'
          />
        </div>
        <div className="mb-4">
          <span className='font-medium'>Mật khẩu</span>
          <input
            name='password'
            type='password'
            placeholder='Mật khẩu'
            onChange={(e)=>setPassword(e.target.value)}
            className='border-[1px] border-bd-color outline-none w-full p-2 rounded-md'
          />
        </div>
        <p className='text-end'>Quên mật khẩu ?</p>
        <button type='submit' className='bg-[#ff3860] text-white rounded-md w-full p-2 my-3'>Đăng nhập</button>
      </form>
      <p className='text-center '>Không có tài khoản ?  <span className='cursor-pointer font-medium'>Đăng kí ngay !</span></p>
      <div className='w-full flex flex-col items-center'>
        <button className='p-2 my-3  font-medium text-[#535a60] hover:text-red-500 border-[1px] border-bd-color w-[70%] rounded-full'>
          <FontAwesomeIcon icon={faGoogle} /> Đăng nhập bằng Google
        </button>
        <button className='p-2 bg-[#395697] hover:bg-[#536b9e] text-white border-[1px] border-bd-color w-[70%] rounded-full'>
          <FontAwesomeIcon icon={faFacebook} /> Đăng nhập bằng Facebook
        </button>
      </div>
    </div>
  );
}

export default Login