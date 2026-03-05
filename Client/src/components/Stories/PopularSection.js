import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFire } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const apiURL = process.env.REACT_APP_API_URL;

const PopularSection = ({ darkMode }) => {
  const [topStories, setTopStories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy top truyện xem nhiều nhất từ StoryView (chính xác)
        const res = await axios.get(`${apiURL}/api/views/top?limit=10`);
        if (res.data) {
          setTopStories(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={`${darkMode ? "bg-bg_dark_light text-text_darkMode" : "bg-white"} laptop:col-span-2 h-screen shadow-lg flex-1`}>
      <div className='w-[50%] uppercase text-primary-color p-3 border-b-2 border-gray-200'>
        <FontAwesomeIcon icon={faFire} className='mr-2' />
        Phổ biến
      </div>
      {topStories.map((item, index) => (
        <Link to={`/detail/${item.slug}`} key={item._id || item.slug}>
          <div className='flex p-2 justify-start cursor-pointer border-b-2 border-gray-200 hover:bg-gray-50 transition'>
            <div className='flex justify-center items-center px-3'>
              <p className='text-primary-color border-[1px] border-primary-color px-2 py-1 font-medium'>{index + 1}</p>
            </div>
            <img
              src={`https://img.otruyenapi.com/uploads/comics/${item.slug}-thumb.jpg`}
              alt={item.storyName || item.slug}
              className='h-20 w-14 object-cover rounded'
            />
            <div className='ml-4 h-fit flex flex-col justify-around'>
              <div className='flex-1 text-sm'>
                <p className='font-medium line-clamp-1'>{item.storyName || item.slug}</p>
              </div>
              <div className='flex font-light text-sm mt-1'>
                <p><FontAwesomeIcon icon={faEye} className="mr-1" /> {item.viewCount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PopularSection;
