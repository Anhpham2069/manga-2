import React from 'react';
import { Profile, ChangePassWord, Gift  } from './Content'; // Nhớ import các component đã tạo

const Content = ({ selectedItem }) => {
  let content;
  if (selectedItem === 1) {
    content = <Profile />;
  } else if (selectedItem === 2) {
    content = <ChangePassWord />;
  } else if (selectedItem === 3) {
    content = <Gift />;
  }

  return <div className="content">{content}</div>;
};

export default Content;
