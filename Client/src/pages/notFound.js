import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Helmet>
        <title>404 - Trang không tồn tại - DocTruyen5s</title>
        <meta name="description" content="Trang bạn đang tìm kiếm không tồn tại." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Không tìm thấy</h1>
      <p className="text-lg text-gray-600 mb-8">Trang bạn đang tìm kiếm không tồn tại.</p>
      <Link to="/" className="text-blue-500 hover:underline">Trang chủ</Link>
    </div>
  );
};

export default NotFoundPage;
