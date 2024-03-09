import React,{useEffect, useState} from 'react'
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../layout/DarkModeSlice';
import { Data } from '../../services/Data';
import CardStories from '../components/cardStories';
// icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFire,faBookmark,faEye,faFilter} from "@fortawesome/free-solid-svg-icons"
// layout
import NavBar from '../layout/Navbar'
import Footer from '../layout/footer'
import { Checkbox } from 'antd';
import axios from 'axios';



const FilterStories = () => {
    const darkMode = useSelector(selectDarkMode)
    // sate
    const [currentPage, setCurrentPage] = useState(1);
    const [genres,setGenres] = useState()
    
    useEffect(()=>{
      const fetchDataGenres= async()=>{
        const res = await axios.get(`https://otruyenapi.com/v1/api/the-loai`)
        // console.log(res)
        if(res.data){
          setGenres(res.data.data)
        }
      }
      fetchDataGenres()
    },[])
    console.log(genres)

    const sortedData = [...Data].sort((a, b) => b.views - a.views);
    function layChapterMoiNhat(tuaTruyen) {
        return tuaTruyen.chapters.reduce((newestChapter, chapter) => (
          chapter.chapter_id > (newestChapter ? newestChapter.chapter_id : -1) ? chapter : newestChapter
        ), null);
      }

    //   phan trang (pagination)
  const truyensPerPage = 10;
  const indexOfLastTruyen = currentPage * truyensPerPage;
  const indexOfFirstTruyen = indexOfLastTruyen - truyensPerPage;
  const currentTruyens = Data.slice(indexOfFirstTruyen, indexOfLastTruyen);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(Data.length / truyensPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <div  className={`${darkMode? "bg-bg_dark_light text-text_darkMode": "bg-bg_light"} `}>
        <NavBar />
            <div className={`
                lg:flex gap-4 w-[90%]  mt-6 m-auto
            `}>
                <div className={`${darkMode? "bg-bg_dark_light text-text_darkMode": "bg-white"} lg:w-[72%] p-2`}>
                    <div className='py-1 h-12 flex items-center  justify-between text-lg font-semibold text-primary-color border-b-[1px] border-[#F0F0F0] '>
                    <p> <FontAwesomeIcon icon={faFilter} /> Tìm kiếm nâng cao</p>
                    </div>
                    <div className={`${darkMode? "bg-bg_dark_light text-text_darkMode": "bg-white"} 
                       mt-10
                    `}>
                        <div className='grid phone:grid-cols-2 tablet:grid-cols-3 lg:grid-cols-4 gap-2'>
                            {genres?.items.map(item=>{
                                return(
                                    <Checkbox>{item.name}</Checkbox>
                                )
                            })}
                        </div>
                        <div className='grid tablet:grid-cols-2 gap-5 mt-10'>
                            <div className='flex justify-between items-center'>
                                <label className='font-semibold text-lg'>Số chương</label>
                                <select className='py-2 border-[1px] w-[50%] rounded-md'>
                                    <option value={"0"}>{">"}=0</option>
                                    <option value={"10"}>{">"}=10</option>
                                    <option value={"50"}>{">"}=50</option>
                                    <option value={"100"}>{">"}=100</option>
                                    <option value={"500"}>{">"}=500</option>
                                </select>
                            </div>
                            <div className='flex justify-between items-center'>
                                <label className='font-semibold text-lg'>Trạng thái</label>
                                <select className='py-2 border-[1px] w-[50%] rounded-md'>
                                    <option value={"all"}>Tất cả</option>
                                    <option value={"on-going"}>Đang hoàn thành</option>
                                    <option value={"hold"}>Tạm ngưng</option>
                                    <option value={"completed"}>Hoàn thành</option>
                                </select>
                            </div>
                            <div className='flex justify-between items-center'>
                                <label className='font-semibold text-lg'>Giới tính</label>
                                <select className='py-2 border-[1px] w-[50%] rounded-md'>
                                    <option value={"male"}>Nam</option>
                                    <option value={"female"}>Nữ</option>
                                    <option value={"other"}>Khác</option>
                                </select>
                            </div>
                            <div className='flex justify-between items-center'>
                                <label className='font-semibold text-lg'>Sắp xếp</label>
                                <select className='py-2 border-[1px] w-[50%] rounded-md'>
                                    <option value={"default"}>Mặc định</option>
                                    <option value={"new-update"}>Mới cập nhật</option>
                                    <option value={"most-view"}>Xem nhiều</option>
                                    <option value={"high-score"}>Đánh giá cao</option>
                                    <option value={"az"}>Từ A-Z</option>
                                    <option value={"za"}>Từ Z-A</option>
                                    <option value={"new"}>Mới nhất</option>
                                    <option value={"old"}>Cũ nhất</option>
                                </select>
                            </div>
                        </div>
                        <button className='bg-[#BD10E0] w-full text-center font-bold rounded-md cursor-pointer hover:bg-[#D360EA] text-white mt-6 p-2 px-2'>Filter</button>
                    </div>
                    <div className={`${darkMode? "bg-bg_dark_light text-text_darkMode": "bg-white"} 
                       mt-10 grid  phone:grid-cols-2 phone:gap-2 tablet:grid-cols-3 lg:grid-cols-4 desktop:grid-cols-5 lg:gap-4 place-items-center
                    `}>
                    {currentTruyens.map((item)=>{
                            const timeAgo = formatDistanceToNow(new Date(item.date_added), { addSuffix: true,locale: vi  }); 
                            const trimmedTimeAgo = timeAgo.replace(/^khoảng\s/, '');
                            const newestChapter = layChapterMoiNhat(item);
                            return(
                            <>
                                <div className='flex flex-col justify-center items-center gap-2'>
                                <CardStories 
                                    // actionButton={promotionButton}
                                    key={item.id}
                                    id={item.id}
                                    title={item.title}
                                    img={item.image}
                                    time={trimmedTimeAgo}
                                    views={item.views}
                                    saves={item.saves}
                                    chapter={newestChapter.chapter_id}
                                    nomarl
                                
                                    /> 
                                    <p className='text-sm'>Chap {(newestChapter.chapter_id)}</p>
                                </div>
                            </>
                            )
                        })}
                    </div>
                    <div className='p-4 w-full border-t-[1px] mt-10'>
                      <Pagination
                          truyensPerPage={truyensPerPage}
                          totalTruyens={Data.length}
                          paginate={paginate}
                          currentPage={currentPage}
                          nextPage={nextPage}
                          prevPage={prevPage}
                      />
                    </div>
                </div>

                {/* Pho bien */}
                <div className={`${darkMode? "bg-bg_dark_light text-text_darkMode": "bg-white"} mt-8 h-fit shadow-lg flex-1`}>
                    <div className='w-[50%] uppercase text-primary-color p-3 border-b-2 border-gray-200 font-semibold' >
                        <FontAwesomeIcon icon={faFire} className='mr-2' />
                        Phổ biến</div>
                        {sortedData .map((item,index) => {
                            if (item.views > 10000) {
                                const timeAgo = formatDistanceToNow(new Date(item.date_added), { addSuffix: true });

                                return (
                                    <div key={item.id} className='flex p-3 justify-start cursor-pointer border-b-2 border-gray-200'>
                                        <div className='flex justify-center items-center px-3'>
                                          <p className='text-primary-color border-[1px] border-primary-color px-2 py-1 font-medium'>{index+1}</p></div>
                                        <img
                                            src={item.image}
                                            alt='anh'
                                            className='h-20'
                                        />
                                        <div className='ml-4 flex flex-col justify-around'>
                                            <div className='flex-1'>
                                                <p>{item.title}</p>
                                                <div className='flex justify-between text-xs'>
                                                    <p className='font-semisemibold text-[#888888] mr-1 '>Thể loại:</p>
                                                    <p className=''> {item.genres}</p>
                                                </div>
                                            </div>
                                            <div className='flex font-light text-sm'>
                                                <p className='mr-2'><FontAwesomeIcon icon={faBookmark} /> {item.saves}</p>
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
            </div>
        <Footer />
    </div>
  )
}

const Pagination = ({ truyensPerPage, totalTruyens, paginate, currentPage, nextPage, prevPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalTruyens / truyensPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <ul className="pagination flex justify-center items-center gap-5">
      <li className="page-item">
        <a href="#" className="page-link" onClick={() => prevPage()}>
          Previous
        </a>
      </li>
      {pageNumbers.map(number => (
        <li key={number} 
            onClick={() => paginate(number)} 
            className={`page-item ${currentPage === number ? 'active bg-primary-color text-white' : ''} cursor-pointer border-[1px] py-2 px-4`}>
          <a  href="#" className="page-link">
            {number}
          </a>
        </li>
      ))}
      <li className="page-item">
        <a href="#" className="page-link" onClick={() => nextPage()}>
          Next
        </a>
      </li>
    </ul>
  );
};

export default FilterStories