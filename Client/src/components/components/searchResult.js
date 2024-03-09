import React,{useState} from 'react'
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../layout/DarkModeSlice';
import { Data } from '../../services/Data';
//cpn
import CardStories from '../components/cardStories';
// icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFire,faBookmark,faEye} from "@fortawesome/free-solid-svg-icons"
// layout
import NavBar from '../layout/Navbar'
import Footer from '../layout/footer'
import { useEffect } from 'react';
import axios from 'axios';
import PopularSection from '../Stories/PopularSection';
import { useParams } from 'react-router-dom';
const SearchResult = () => {
    const darkMode = useSelector(selectDarkMode)
    
    const {slug,keyword} = useParams()


    const [storiesData,setStoriesData] = useState([])
    // sate
    const [currentPage, setCurrentPage] = useState(1);

    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Thêm hàm để xử lý khi input bị focus và blur
;
  
  // Thêm useEffect để gọi API mỗi khi từ khóa tìm kiếm thay đổi
  useEffect(() => {
    const fetchData = async () => {
      if (keyword.trim() !== "") {
        setIsLoading(true);
        try {
          const response = await axios.get(
            "https://otruyenapi.com/v1/api/tim-kiem",
            {
              params: {
                keyword,
              },
            }
          );
          setSearchResults(response.data.data);
        } catch (error) {
          console.error("Error fetching search results:", error);
          setError("An error occurred while searching. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]); // Nếu từ khóa tìm kiếm là rỗng, đặt kết quả tìm kiếm thành rỗng
      }
    };
  
    fetchData();
  }, [keyword]); 

    const sortedData = [...Data].sort((a, b) => b.views - a.views);
    function layChapterMoiNhat(tuaTruyen) {
        return tuaTruyen.chapters.reduce((newestChapter, chapter) => (
          chapter.chapter_id > (newestChapter ? newestChapter.chapter_id : -1) ? chapter : newestChapter
        ), null);
      }
  useEffect(()=>{
    const fetchData =  async ()=>{
      const res = await axios.get(`https://otruyenapi.com/v1/api/home`)
      
      if(res.data){
        setStoriesData(res.data.data)
      }
    }
    fetchData()
  },[])
  console.log(storiesData)
    //   phan trang (pagination)
  const truyensPerPage = 10;
  const indexOfLastTruyen = currentPage * truyensPerPage;
  const indexOfFirstTruyen = indexOfLastTruyen - truyensPerPage;
  const currentTruyens = searchResults.items?.slice(indexOfFirstTruyen, indexOfLastTruyen);

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
    <div  className={`${darkMode? "bg-bg_dark text-text_darkMode": "bg-bg_light"}`}>
        <NavBar />
            <div className={`
                flex phone:flex-col gap-4 w-[95%]  mt-6 m-auto
            `}>
                <div className={`${darkMode? "bg-bg_dark_light text-text_darkMode": "bg-white"} phone:w-full w-full p-2`}>
                    <div className='py-1 h-12 flex items-center  justify-between text-lg font-semibold text-primary-color border-b-[1px] border-[#F0F0F0] '>
                                <p>All Manga</p>
                    </div>
                    <div className={`${darkMode? "bg-bg_dark_light text-text_darkMode": "bg-white"} 
                      mt-10  grid  phone:grid-cols-2 phone:gap-2 tablet:grid-cols-3 lg:grid-cols-3 desktop:grid-cols-5 lg:gap-4 place-items-center
                    `}>
                    {currentTruyens?.map((item,index)=>{
                            const timeAgo = formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true,locale: vi  }); 
                            const trimmedTimeAgo = timeAgo.replace(/^khoảng\s/, '');
                            // const newestChapter = layChapterMoiNhat(item);
                            return(
                            <>
                                <div className='flex flex-col justify-center items-center gap-2'>
                                <CardStories 
                                  key={item._id}
                                  id={item._id}
                                  title={item.name}
                                  img={`https://img.otruyenapi.com/uploads/${searchResults.seoOnPage.og_image?.[index]}`}  
                                  slug={item.slug}  
                                  time={trimmedTimeAgo}              
                                  nomarl                  
                                  />     
                                    {/* <p className='text-sm'>Chap {(newestChapter.chapter_id)}</p> */}
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
                {/* <div className={`${darkMode? "bg-bg_dark_light text-text_darkMode": "bg-white"} h-fit shadow-lg flex-1`}> */}
                       <PopularSection darkMode={darkMode} sortedData={sortedData} />
                    {/* </div> */}
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

export default SearchResult
