import React,{useState} from 'react'
import NavBar from '../layout/Navbar'
import Footer from '../layout/footer'
import Sidebar from './Sidebar'
import Content from './ContentCpn'

const UserComponent = () => {
  const [selectedItem, setSelectedItem] = useState(1);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };
  return (
    <div>
        <NavBar />
        <div className='w-[90%] h-fit m-auto mt-10 bg-white'>
            <header className='text-primary-color border-b-[1px] border-gray-200 '>
                <p className='text-xl font-bold p-3'>Tài khoản</p>
            </header>
            <div className='laptop:flex'>
                <Sidebar onItemClick={handleItemClick}/>
                <div className='laptop:w-[70%] flex flex-col justify-center items-center'> 
                  <div className='w-full'>
                    <img className='h-40 rounded-full m-auto' src='https://i.pinimg.com/736x/4e/06/0b/4e060bd1ec00e99dad7bb8a684411209.jpg' alt='anh'/>
                    <div className='w-full'>
                      <div className='w-[70%] m-auto '>
                        <div className='w-full flex justify-between font-semibold'>
                          <span>Cấp 1</span>
                          <span>Cấp 2</span>
                        </div>
                        <div className='w-full h-4 bg-[#e8ebf5] rounded-full'>
                          <div className='w-20 text-xs text-center h-full animate-pulse bg-cover rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600'>
                            10%
                          </div> 
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='w-full p-6'>
                    <Content selectedItem={selectedItem} />
                  </div>
                  
                </div>
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default UserComponent