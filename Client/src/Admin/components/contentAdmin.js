import React from 'react';
import Dasbroad from '../page/dashboard';
import StoriesAdmin from '../page/stories';
import UserManage from '../page/user';
import GenresAdmin from '../page/genres';
import AdminNotificationForm from '../page/noti';
// import { Profile, ChangePassWord, Gift  } from './Content'; // Nhớ import các component đã tạo

const ContentAdmin = ({ selectedItem }) => {
  let content;
    if (selectedItem === 1) {
        content = <Dasbroad />;
    } else if (selectedItem === 2) {
        content = <StoriesAdmin />;
    } else if (selectedItem === 4) {
        content = <UserManage />;
    } else if(selectedItem == 3){
      content = <GenresAdmin />
    } else if(selectedItem == 5){
      content = <AdminNotificationForm />
    }

  return <div className="content">{content}</div>;
};

export default ContentAdmin;