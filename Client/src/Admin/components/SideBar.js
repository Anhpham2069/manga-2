import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faLock, faGift } from '@fortawesome/free-solid-svg-icons';
import { DashboardOutlined, NotificationFilled, ProfileFilled, ReadOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';

const SideBarAdmin = ({ onItemClick }) => {
  const menuItems = [
    { label: 'Dashboard', icon: <DashboardOutlined />,icon2:<RightOutlined /> , key: 1 },
    { label: 'Stories', icon: <ProfileFilled />,icon2:<RightOutlined />, key: 2 },
    { label: 'Genre', icon: <ReadOutlined />,icon2:<RightOutlined />, key: 3 },
    { label: 'User', icon: <UserOutlined />,icon2:<RightOutlined />, key: 4 },
    { label: 'Notification', icon: <NotificationFilled />,icon2:<RightOutlined />, key: 5 },
  ];
  


  const [active, setActive] = useState(1);

  const handleClick = (index) => {
    setActive(index === active ? null : index);
    onItemClick(index);
  };

  return (
    <div className="bg-gray-800 text-white h-[82vh] w-44">
      {menuItems.map((item) => (
        <div
          key={item.key}
          onClick={() => handleClick(item.key)}
          className={`p-4 cursor-pointer ${
            active === item.key ? 'bg-gray-600' : ''
          } hover:bg-gray-700`}
        >
          <div className="flex items-center text-base">
            <div className="mr-3 ">{item.icon}</div>
            <div className='flex justify-between flex-1'>
              <div className="">{item.label}</div>

              <div className={`text-sm transform ${active === item.key ? 'rotate-90' : 'rotate-0'}`}>
                {item.icon2}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SideBarAdmin;
