import React,{useEffect,useState} from 'react';
// import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFire } from '@fortawesome/free-solid-svg-icons';
import { getAllHistory } from '../../services/apiStoriesRequest';



const PopularSection = ({ darkMode }) => {
    const [readHistory, setReadHistory] = useState();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await getAllHistory()
            if (res) {
              setReadHistory(res);
            }
          } catch (error) {
            console.log(error);
          }
        };
        fetchData();
      }, []);
      console.log(readHistory)
  return (
    <div className={`${darkMode? "bg-bg_dark_light text-text_darkMode": "bg-white"} laptop:col-span-2  h-screen shadow-lg flex-1`}>
                    <div className='w-[50%] uppercase text-primary-color p-3 border-b-2 border-gray-200'>
                        <FontAwesomeIcon icon={faFire} className='mr-2' />
                        Phổ biến</div>
                        {readHistory?.slice(0,10).map((item,index) => {
                            if (item.readCount > 3) {
                                return (
                                    <div key={item._id} className='flex p-2 justify-start cursor-pointer border-b-2 border-gray-200'>
                                        <div className='flex justify-center items-center px-3'>
                                          <p className='text-primary-color border-[1px] border-primary-color px-2 py-1 font-medium'>{index+1}</p></div>
                                        <img
                                            src={item.storyInfo?.seoOnPage.seoSchema.image}
                                            alt='anh'
                                            className='h-20'
                                        />
                                        <div className='ml-4 h-fit flex flex-col justify-around'>
                                            <div className='flex-1 text-sm'>
                                                <p>{item.storyInfo.item.name}</p>
                                                <div className='flex justify-between text-xs'>
                                                    <p className='font-semibold text-[#888888] mr-1 '>Thể loại:</p>
                                                    <p className=''> {item.genres}</p>
                                                </div>
                                            </div>
                                            <div className='flex font-light text-sm'>
                                                <p><FontAwesomeIcon icon={faEye} /> {item.readCount.toLocaleString()} </p>
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
