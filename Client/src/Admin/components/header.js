import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faMagnifyingGlass,faUser,faSun, faMoon,faUserPlus,
  faBars,faRightFromBracket,faClockRotateLeft,faBookmark,faCircleUser} from "@fortawesome/free-solid-svg-icons"

  import { useSelector, useDispatch } from 'react-redux';
  import { selectDarkMode, toggleDarkMode } from '../../components/layout/DarkModeSlice';
  
  
  
const HeaderAdmin = () => {
    const isDarkModeEnable = useSelector(selectDarkMode)
    const dispatch = useDispatch()
    

    const handleToggleDarkMode = () => {
        dispatch(toggleDarkMode());
      };
  return (
    <div className='p-3  flex justify-between bg-primary-color text-white items-center text-2xl'>
        <img  src='https://manga.io.vn/uploads/images/logo.png'></img>
        <div className='text-lg font-bold '>Truyện siêu cấp vip pro </div>
        <div>
            <div 
                className='cursor-pointer phone:hidden lg:block' 
                onClick={handleToggleDarkMode}
              >{isDarkModeEnable ? 
                <FontAwesomeIcon icon={faMoon}color='grey' size='xl'/>
                :
                <FontAwesomeIcon icon={faSun}  size='xl'/>
              }
                </div>
        </div>
    </div>
  )
}

export default HeaderAdmin