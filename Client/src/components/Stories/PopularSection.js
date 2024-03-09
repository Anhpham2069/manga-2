import React from 'react';
// import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFire } from '@fortawesome/free-solid-svg-icons';

const PopularSection = ({ sortedData,darkMode }) => {
  return (
    <div className={`${darkMode? "bg-bg_dark_light text-text_darkMode": "bg-white"} laptop:col-span-2  h-screen shadow-lg flex-1`}>
                    <div className='w-[50%] uppercase text-primary-color p-3 border-b-2 border-gray-200'>
                        <FontAwesomeIcon icon={faFire} className='mr-2' />
                        Phổ biến</div>
                        {sortedData.map((item,index) => {
                            if (item.views > 10000) {
                                return (
                                    <div key={item.id} className='flex p-2 justify-start cursor-pointer border-b-2 border-gray-200'>
                                        <div className='flex justify-center items-center px-3'>
                                          <p className='text-primary-color border-[1px] border-primary-color px-2 py-1 font-medium'>{index+1}</p></div>
                                        <img
                                            src={item.image}
                                            alt='anh'
                                            className='h-20'
                                        />
                                        <div className='ml-4 h-fit flex flex-col justify-around'>
                                            <div className='flex-1 text-sm'>
                                                <p>{item.title}</p>
                                                <div className='flex justify-between text-xs'>
                                                    <p className='font-semibold text-[#888888] mr-1 '>Thể loại:</p>
                                                    <p className=''> {item.genres}</p>
                                                </div>
                                            </div>
                                            <div className='flex font-light text-sm'>
                                                <p><FontAwesomeIcon icon={faEye} /> {item.views.toLocaleString()} </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            } else {
                                return null; // Không hiển thị truyện có views dưới 10000
                            }
                        })}

                
            
                    </div>
           
  );
};

export default PopularSection;
