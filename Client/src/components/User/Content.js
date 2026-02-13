import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { changePasswordUser } from '../../services/apiLoginRequest';
import { message } from "antd";

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

  const [passWord, setPassWord] = useState("");
  const [newPassWord, setNewPassWord] = useState("");
  const [confirmPassWord, setConfirmPassWord] = useState("");

  const [errors, setErrors] = useState({});

  const handleChangePassword = async () => {
    let newErrors = {};
    let hasError = false;

    // Validate mật khẩu hiện tại
    if (!passWord.trim()) {
      newErrors.passWord = "Vui lòng nhập mật khẩu hiện tại";
      hasError = true;
    }

    // Validate mật khẩu mới
    if (!newPassWord.trim()) {
      newErrors.newPassWord = "Vui lòng nhập mật khẩu mới";
      hasError = true;
    } else if (newPassWord.length < 6) {
      newErrors.newPassWord = "Mật khẩu mới phải ít nhất 6 ký tự";
      hasError = true;
    }

    // Validate xác nhận mật khẩu
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

      // reset form
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
    <div className="w-full max-w-md">
      <p className="text-2xl font-medium mb-4">Đổi mật khẩu</p>

      <div className="mb-3">
        <TextInput
          label="Mật khẩu hiện tại"
          value={passWord}
          onChange={(e) => {
            setPassWord(e.target.value);
            setErrors({ ...errors, passWord: "" });
          }}
          type="password"
        />
        {errors.passWord && (
          <p className="text-red-500 text-sm mt-1">{errors.passWord}</p>
        )}
      </div>

      <div className="mb-3">
        <TextInput
          label="Mật khẩu mới"
          value={newPassWord}
          onChange={(e) => {
            setNewPassWord(e.target.value);
            setErrors({ ...errors, newPassWord: "" });
          }}
          type="password"
        />
        {errors.newPassWord && (
          <p className="text-red-500 text-sm mt-1">{errors.newPassWord}</p>
        )}
      </div>

      <div className="mb-3">
        <TextInput
          label="Xác nhận mật khẩu mới"
          value={confirmPassWord}
          onChange={(e) => {
            setConfirmPassWord(e.target.value);
            setErrors({ ...errors, confirmPassWord: "" });
          }}
          type="password"
        />
        {errors.confirmPassWord && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassWord}
          </p>
        )}
      </div>

      <div className="w-full flex justify-center mt-4">
        <button
          onClick={handleChangePassword}
          className="px-5 py-2 rounded-md bg-[#FF3860] text-white hover:bg-red-600 transition"
        >
          Lưu
        </button>
      </div>
    </div>
  );
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
