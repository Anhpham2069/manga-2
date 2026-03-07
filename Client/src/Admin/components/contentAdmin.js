import React from 'react';
import Dasbroad from '../page/dashboard';
import StoriesAdmin from '../page/stories';
import UserManage from '../page/user';
import GenresAdmin from '../page/genres/allCategory';
import AdminNotificationForm from '../page/noti';
import ErrComponent from '../page/erorr';
import CommentManage from '../page/comment';
import StickerAdmin from '../page/stickers';

const ContentAdmin = ({ selectedItem }) => {
  let content;
  if (selectedItem === 1) {
    content = <Dasbroad />;
  } else if (selectedItem === 2) {
    content = <StoriesAdmin />;
  } else if (selectedItem === 4) {
    content = <UserManage />;
  } else if (selectedItem === 3) {
    content = <GenresAdmin />
  } else if (selectedItem === 5) {
    content = <AdminNotificationForm />
  } else if (selectedItem === 6) {
    content = <ErrComponent />
  } else if (selectedItem === 7) {
    content = <CommentManage />
  } else if (selectedItem === 8) {
    content = <StickerAdmin />
  }

  return <div className="content">{content}</div>;
};

export default ContentAdmin;