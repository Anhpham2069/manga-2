// StoryListByGenre.js
import React,{useState} from 'react'
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { selectDarkMode } from '../layout/DarkModeSlice';
//cpn
import PopularSection from './PopularSection';
import CardStories from '../components/cardStories';
// icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFire,faBookmark,faEye} from "@fortawesome/free-solid-svg-icons"
// layout
import NavBar from '../layout/Navbar'
import Footer from '../layout/footer'

import { Data } from '../../services/Data';

const StoryListByGenre = ({ stories }) => {
  const { genre } = useParams();

  const darkMode = useSelector(selectDarkMode)
    // sate
    const [currentPage, setCurrentPage] = useState(1);

    const sortedData = [...Data].sort((a, b) => b.views - a.views);
    function layChapterMoiNhat(tuaTruyen) {
        return tuaTruyen.chapters.reduce((newestChapter, chapter) => (
          chapter.chapter_id > (newestChapter ? newestChapter.chapter_id : -1) ? chapter : newestChapter
        ), null);
      }

  const filteredStories = Data.filter(story => story.genres.includes(genre));

    //   phan trang (pagination)
  const truyensPerPage = 10;
  const indexOfLastTruyen = currentPage * truyensPerPage;
  const indexOfFirstTruyen = indexOfLastTruyen - truyensPerPage;
  const currentTruyens = filteredStories.slice(indexOfFirstTruyen, indexOfLastTruyen);

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
    <div>
    
      <div  className={`${darkMode? "bg-bg_dark text-text_darkMode": "bg-bg_light"}`}>
        <NavBar />
            <div className={`
                flex gap-4 w-[90%]  mt-6 m-auto
            `}>
                <div className={`${darkMode? "bg-bg_dark_light text-text_darkMode": "bg-white"} w-[72%] p-2`}>
                    <div className='py-1 h-12 flex items-center  justify-between text-lg font-semibold text-primary-color border-b-[1px] border-[#F0F0F0] '>
                                <p>{genre}</p>
                    </div>
                    <div className={`${darkMode? "bg-bg_dark_light text-text_darkMode": "bg-white"} 
                      mt-10  grid  phone:grid-cols-2 phone:gap-2 tablet:grid-cols-3 lg:grid-cols-4 desktop:grid-cols-5 lg:gap-4 place-items-center
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
                          totalTruyens={currentTruyens.length}
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
    </div>
  );
};


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

export default StoryListByGenre;
