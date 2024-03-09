import React from 'react'
import NavBar from '../layout/Navbar'
import Slider from './slider';
import ScheduleList from './schedule-list';
import TrendStoriesCpn from './trendStories';
import Featured from './featured';
import Footer from '../layout/footer';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../layout/DarkModeSlice';

const HomeLayout = () => {
  const isDarkModeEnable = useSelector(selectDarkMode)
  return (
    <div className={`${isDarkModeEnable ?"bg-bg_dark":"bg-bg_light" }`}>
        <NavBar />
        <div className='pt-3 lg:px-14 tablet:px-6 '>
        <Slider />
        </div>
        <div className='lg:pt-10 tablet:px-6 lg:px-14 '>
        <ScheduleList />
        </div>
        <div className='lg:pt-10 tablet:px-6 lg:px-14 '>
        <TrendStoriesCpn />
        </div>
        {/* <div className='lg:px-14 tablet:px-6'> */}
          <Featured dark={isDarkModeEnable}/>
        {/* </div> */}
        <Footer />
    </div>
  )
}

export default HomeLayout