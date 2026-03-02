import React from 'react'
import { Helmet } from 'react-helmet'
import HomeLayout from '../components/HomeComponent'

const Home = () => {
  return (
    <div className='w-full'>
      <Helmet>
        <title>DocTruyen5s - Đọc Truyện Tranh Online Miễn Phí</title>
        <meta name="description" content="Đọc truyện tranh online miễn phí, cập nhật nhanh nhất. Kho truyện tranh khổng lồ với hàng nghìn bộ truyện hot nhất hiện nay." />
        <meta property="og:title" content="DocTruyen5s - Đọc Truyện Tranh Online Miễn Phí" />
        <meta property="og:description" content="Đọc truyện tranh online miễn phí, cập nhật nhanh nhất. Kho truyện tranh khổng lồ với hàng nghìn bộ truyện hot nhất hiện nay." />
        <meta property="og:type" content="website" />
      </Helmet>
      <HomeLayout />
    </div>
  )
}

export default Home