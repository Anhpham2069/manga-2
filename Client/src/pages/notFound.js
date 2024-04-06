import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Không tìm thấy</h1>
      <p className="text-lg text-gray-600 mb-8">Trang bạn đang tìm kiếm không tồn tại.</p>
      <Link to="/" className="text-blue-500 hover:underline">Trang chủ</Link>
    </div>
  );
};

export default NotFoundPage;
