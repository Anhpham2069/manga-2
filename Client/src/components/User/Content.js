import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { changePasswordUser } from '../../services/apiLoginRequest';

const Profile = () => {
  
  const [displayName, setDisplayName] = useState('Anh Phạm');
  const [coin, setCoin] = useState('0');
  const [googleId, setGoogleId] = useState(null);
  const [facebookId, setFacebookId] = useState(null);
  const [email, setEmail] = useState('Anhp2069@gmail.com');

  const user = useSelector((state) => state?.auth.login.currentUser);

  console.table(user)


  console.log(displayName)
  const handleChange = (e, setStateFunction) => {
    setStateFunction(e.target.value);
  };
  return (
    <div className=' w-full'>
      <p className='text-2xl font-medium mb-2'>Thông tin tài khoản</p>
      <TextInput label="Tên hiển thị" value={user?.username} />
      <TextInput label="Địa chỉ Email" value={user?.email} />
      <TextInput label="Google ID" value={googleId} />
      <TextInput label="Facebook ID" value={facebookId} />
      <div className='w-full flex justify-center'>
        <button className='m-auto p-2 px-3 rounded-sm hover:bg-primary-color text-white bg-[#FF3860]'>Lưu</button>
      </div>
    </div>
  );
};

// mat khau

const ChangePassWord = () => {

  const user = useSelector((state) => state?.auth.login.currentUser);


  const [passWord,setPassWord] = useState()
  const [newPassWord,setNewPassWord] = useState()

  const handleChangePassword = (e) =>{
    // e.preventDefault()

    changePasswordUser(user?._id,passWord,newPassWord)
  }

  return (
    <div className='w-full'>
      <p className='text-2xl font-medium mb-2'>Đổi mật khẩu</p>
      <TextInput label="Mật khẩu hiện tại" value={passWord} onChange={(e)=>setPassWord(e.target.value)} type="password" />
      <TextInput label="Mật khẩu mới " value={newPassWord} onChange={(e)=>setNewPassWord(e.target.value)} type="password" />
      <TextInput label="Xác nhận mật khẩu mới " value={newPassWord} onChange={(e)=>setNewPassWord(e.target.value)} />

      <div className='w-full flex justify-center'>
        <button onClick={()=>handleChangePassword()} className='m-auto p-2 px-3 rounded-sm hover:bg-primary-color text-white bg-[#FF3860]'>Lưu</button>
      </div>
    </div>
  )
};



// qua tang

const Gift = () => {
  return (
    <div className='w-full'>
      <p className='text-2xl font-medium mb-2'>Đổi thẻ quà tặng</p>
      <TextInput label="COIN" />
      <TextInput label="LOẠI THẺ " />
      <TextInput label="TỔNG THANH TOÁN " />

      <div className='w-full flex justify-center'>
        <button className='m-auto p-2 px-3 rounded-sm hover:bg-primary-color text-white bg-[#FF3860]'>Đổi</button>
      </div>
      <p className='text-2xl font-medium mb-2'>Danh sách thẻ</p>
      <table className="my-4 border-2 border-[#666666] w-full  text-[#424242]">
        <thead>
          <tr className='text-lg'>
            <th className="border-2 border-[#666666] p-2 text-start">#</th>
            <th className="border-2 border-[#666666] p-2 text-start">Loại</th>
            <th className="border-2 border-[#666666] p-2 text-start">Code</th>
            <th className="border-2 border-[#666666] p-2 text-start">Serial</th>
            <th className="border-2 border-[#666666] p-2 text-start">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-2 border-[#666666] p-2">alo</td>
            <td className="border-2 border-[#666666] p-2">alo</td>
            <td className="border-2 border-[#666666] p-2">alo</td>
            <td className="border-2 border-[#666666] p-2">alo</td>
            <td className="border-2 border-[#666666] p-2">alo</td>
          </tr>
        </tbody>
    </table>
    </div>
  )
};



const TextInput = ({ label, value,onChange,type }) => (
  <div>
    <p className='text-gray-500'>{label}</p>
    <input 
      className='w-full border-[1px] border-[#DBDBDB] p-2 rounded-md mb-2' 
      value={value} 
      onChange={onChange}
      type={type}
      
    />
  </div>
);
export { Profile, ChangePassWord, Gift };
