import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleUser,faLock,faGift} from '@fortawesome/free-solid-svg-icons'
const Sidebar = ({ onItemClick }) => {
  const [active, setActive] = useState(1);

  const handleClick = (index) => {
    setActive(index === active ? null : index);
    onItemClick(index)
  }
  console.log(onItemClick)

  return (
    <div className=' p-8 my-10 ml-10 lg:mr-0 mr-10 bg-[#F2F2F2]'>
      <ul className='text-lg font-medium'>
        <li onClick={() => handleClick(1) } 
          className={`${active === 1 ? "text-primary-color" : ""} cursor-pointer `}>
          <FontAwesomeIcon icon={faCircleUser} /> Thông tin tài khoản
        </li>
        <li onClick={() => handleClick(2) } 
          className={`${active === 2 ? "text-primary-color" : ""} my-6 cursor-pointer `}>
          <FontAwesomeIcon icon={faLock} /> Đổi mật khẩu
        </li>
        <li onClick={() => handleClick(3) } 
          className={`${active === 3 ? "text-primary-color" : ""} cursor-pointer`}>
          <FontAwesomeIcon icon={faGift} /> Đổi thẻ quà tặng
        </li>
      </ul>
    </div>
  )
}

export default Sidebar;