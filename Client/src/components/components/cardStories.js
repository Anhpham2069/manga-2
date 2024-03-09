// import React from "react";
// import { Link } from "react-router-dom";
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import { faBookmark, faEye } from "@fortawesome/free-solid-svg-icons";
// import { useSelector } from "react-redux";
// import { selectDarkMode } from "../layout/DarkModeSlice";
// import { Tooltip } from "antd";

// const CardStories = ({
//   slug,
//   title,
//   img,
//   time,
//   nomarl,
//   hot,
//   chapter,
//   timeup,
// }) => {
//   const isDarkModeEnable = useSelector(selectDarkMode);
//   return (
//     <div className="flex w-full justify-between relative bg-[#E6F4FF] hover:bg-[#d2e7f7] transition-all rounded-3xl ">
//         <div className="flex gap-2 flex-1">
//         <div className="relative w-1/6 overflow-hidden">
//             <Link to={`/detail/${slug}`}>
//             <img
//                 src={img}
//                 alt="anh"
//                 className="w-full h-full object-cover transition-all duration-500 transform hover:scale-125"
//             />
//             {/* <div className='bg-black h-1/6 opacity-50 w-full absolute bottom-0 text-white text-sm flex items-center justify-start p-1'>
//                                 <p className='mr-2'><FontAwesomeIcon icon={faBookmark} /> {saves}</p>
//                                 <p><FontAwesomeIcon icon={faEye} />{views} </p>
//                             </div> */}
//             </Link>
//         </div>
//             <p
//                 className={`${
//                 isDarkModeEnable ? "text-[#CCCCCC]" : "text-black "
//                 } font-semibold mt-3`}
//             >
//                 {title}
//             </p>
//         </div>
//         <div className="flex justify-start items-center gap-2 pr-2">
//         <button className=" p-2 m-1 bg-[#FF4500] text-white text-3xl shadow-md rounded-full font-medium ">
//             Chương {chapter}
//           </button>
//           <p className="font-semibold text-xl">{timeup}</p>
//         </div>

//       <div className=""></div>
//       {/* {nomarl ? (
//         <>
//           <button className="promotion-button w-fit p-1 m-1 bg-primary-color text-white text-xs shadow-md rounded-md font-medium absolute top-1 left-1">
//             {time}
//           </button>
//           <button className="promotion-button w-fit p-3 m-1 bg-[#FF4500] text-white text-3xl shadow-md rounded-full font-medium absolute top-24 right-60">
//             Chương {chapter}
//           </button>
//         </>
//       ) : (
//         ""
//       )}
//       {hot ? (
//         <button className="hot-button w-2/6 h-[10%] bg-[#FF4500] text-white text-xs shadow-md rounded-md font-medium uppercase absolute top-1 right-1">
//           Hot
//         </button>
//       ) : (
//         ""
//       )} */}
//     </div>
//   );
// };

// export default CardStories;

import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faEye } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../layout/DarkModeSlice';
import { Skeleton, Tooltip } from 'antd';

const CardStories = ({loading, slug, id, title, img, time, views = 1000, saves = 100, nomarl, hot, chapter }) => {
    const isDarkModeEnable = useSelector(selectDarkMode);
    console.log(chapter)
    return (
        <Link to={`/detail/${slug}`}>

                <figure className='h-72 mr-4 relative cursor-pointer'>
                    <div className='relative h-52 w-44 overflow-hidden'>
                        <img
                            src={img}
                            alt='anh'
                            className='w-full h-full object-cover transition-all duration-500 transform hover:scale-125'
                        />
                        {/* <div className='bg-black h-1/6 opacity-50 w-full absolute bottom-0 text-white text-sm flex items-center justify-start p-1'>
                            <p className='mr-2'><FontAwesomeIcon icon={faBookmark} /> {saves}</p>
                            <p><FontAwesomeIcon icon={faEye} />{views} </p>
                        </div> */}
                    </div>
                    <div>
                        <Tooltip placement='top' title={title}>
                            <p className={`${isDarkModeEnable ? "text-[#CCCCCC]" : "text-black "} font-semibold mt-3`}>{title.slice(0, 20)} ...</p>
                        </Tooltip>
                    </div>
                    {nomarl ?
                        <>
                            <button className="promotion-button w-fit p-1 m-1 bg-primary-color text-white text-xs shadow-md rounded-md font-medium absolute top-1 left-1">{time}</button>
                            <button className="promotion-button w-fit p-1 m-1 bg-[#FF4500] text-white text-xs shadow-md rounded-md font-medium absolute top-1 right-1">Chương: {chapter}</button>
                        </>
                        : ''}
                    {hot ? <button className="hot-button w-2/6 h-[10%] bg-[#FF4500] text-white text-xs shadow-md rounded-md font-medium uppercase absolute top-1 right-1">Hot</button> : ""}
                </figure>
        </Link>
    )
}

export default CardStories;
