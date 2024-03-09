import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../layout/DarkModeSlice';
import axios from 'axios';

const timeData = [
    {
        time: "[00:00]",
        value: "LINH KHÍ KHÔI PHỤC: TA MỖI NGÀY THU ĐƯỢC MỘT CÁI KỸ NĂNG MỚI - Chapter 152"
    },
    {
        time: "[00:00]",
        value: "LINH KHÍ KHÔI PHỤC: TA MỖI NGÀY THU ĐƯỢC MỘT CÁI KỸ NĂNG MỚI - Chapter 152"
    },
    {
        time: "[00:00]",
        value: "LINH KHÍ KHÔI PHỤC: TA MỖI NGÀY THU ĐƯỢC MỘT CÁI KỸ NĂNG MỚI - Chapter 152"
    },
    {
        time: "[00:00]",
        value: "LINH KHÍ KHÔI PHỤC: TA MỖI NGÀY THU ĐƯỢC MỘT CÁI KỸ NĂNG MỚI - Chapter 152"
    },
    {
        time: "[00:00]",
        value: "LINH KHÍ KHÔI PHỤC: TA MỖI NGÀY THU ĐƯỢC MỘT CÁI KỸ NĂNG MỚI - Chapter 152"
    },
    {
        time: "[00:00]",
        value: "LINH KHÍ KHÔI PHỤC: TA MỖI NGÀY THU ĐƯỢC MỘT CÁI KỸ NĂNG MỚI - Chapter 152"
    },
    {
        time: "[00:00]",
        value: "LINH KHÍ KHÔI PHỤC: TA MỖI NGÀY THU ĐƯỢC MỘT CÁI KỸ NĂNG MỚI - Chapter 152"
    },
    {
        time: "[00:00]",
        value: "LINH KHÍ KHÔI PHỤC: TA MỖI NGÀY THU ĐƯỢC MỘT CÁI KỸ NĂNG MỚI - Chapter 152"
    },
    {
        time: "[00:00]",
        value: "LINH KHÍ KHÔI PHỤC: TA MỖI NGÀY THU ĐƯỢC MỘT CÁI KỸ NĂNG MỚI - Chapter 152"
    },
    {
        time: "[00:00]",
        value: "LINH KHÍ KHÔI PHỤC: TA MỖI NGÀY THU ĐƯỢC MỘT CÁI KỸ NĂNG MỚI - Chapter 152"
    },
    {
        time: "[00:00]",
        value: "LINH KHÍ KHÔI PHỤC: TA MỖI NGÀY THU ĐƯỢC MỘT CÁI KỸ NĂNG MỚI - Chapter 152"
    },
    {
        time: "[00:00]",
        value: "LINH KHÍ KHÔI PHỤC: TA MỖI NGÀY THU ĐƯỢC MỘT CÁI KỸ NĂNG MỚI - Chapter 152"
    },
];

const ScheduleList = () => {
    const [storiesData, setStoriesData] = useState([]);
      const [slug,setSlug] = useState('truyen-moi')
      const [loading,setLoading] = useState(false)
      // sate
    
    
      useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          try {
            const res = await axios.get(
              `https://otruyenapi.com/v1/api/danh-sach/${slug}`
            );
      
            if (res.data) {
              setStoriesData(res.data.data);
            }
          } catch (error) {
            // Xử lý lỗi ở đây, ví dụ:
            console.error('Error fetching data:', error);
            // Có thể hiển thị thông báo lỗi cho người dùng hoặc xử lý theo cách phù hợp khác
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }, [slug]);
      
      console.log(storiesData);
    const isDarkModeEnable = useSelector(selectDarkMode)

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('vi-VN');
    return (
    <div className={`${isDarkModeEnable ?"bg-bg_dark_light text-text_darkMode":"bg-white" } h-fit p-5  w-full shadow-lg `}>
        <div className='phone:flex-row  h-full lg:flex phone:text-xs tablet:text-sm'>
            <div className={`${isDarkModeEnable?"bg-[#3A64C2] text-text_darkMode ":"bg-primary-color" } text-white lg:w-2/12 phone:w-full phone:text-sm  tablet:text-lg text-center  phone:rounded-3xl lg:rounded-lg'`}>
                <p className='phone:p-2  tablet:p-4 font-semibold'>Lịch Ra truyện Ngày: {formattedDate} </p>
            </div>
            <div className='pl-4'>
                {storiesData.items?.slice(0, 10).map((item,index)=>{
                    const dateObject = new Date(item.updatedAt);
                    
                    const hour = dateObject.getHours();
                    const minute = dateObject.getMinutes();
                    const second = dateObject.getSeconds();
                    return(
                        <div className='flex phone:text-xs laptop:text-base tablet:gap-10 tablet:text-base  py-2'>
                            <p className='text-green-400'>[{hour}:{minute}]</p>
                            <div className='flex'>
                                <p  className={`${isDarkModeEnable?"text-text_darkMode":"text-[#73868C]"} font-semibold pl-1`}>{(item.chaptersLatest[0].filename).slice(0, (item.chaptersLatest[0].filename).indexOf("[")).trim()}</p>
                                <p  className={`${isDarkModeEnable?"text-text_darkMode":"text-slate-900"} font-semibold pl-1`}> - {(item.chaptersLatest[0].filename).slice((item.chaptersLatest[0].filename).indexOf("[")).trim()}</p>
                            </div>

                        </div>
                    )
                })}
            </div>
        </div>        
    </div>
  )
}

export default ScheduleList