import React from 'react'

const Footer = () => {
  return (
    <div className='bg-[#222222] text-[#ccc] w-full mt-10'>
        <div className='bg-[#2B2B2B] flex justify-center items-center w-full h-9' >
            <a>Điều khoản sử dụng</a>
            <a className='lg:mx-10 phone:mx-5'>DCMA</a>
            <a>Chính sách bảo mật</a>
        </div>
        <div className='flex-col w-full m-auto  items-center phone:px-10 tablet:px-32 lg:px-80'>
            <img className='m-auto' src='https://doctruyen5s.top/uploads/images/logo.png' alt='anh'></img>
            <p>Mọi thông tin và hình ảnh trên website đều được sưu tầm trên Internet.
                 Chúng tôi không sở hữu hay chịu trách nhiệm bất kỳ thông tin nào trên web này. 
                 Nếu làm ảnh hưởng đến cá nhân
                 hay tổ chức nào, khi được yêu cầu, chúng tôi sẽ xem xét và gỡ bỏ ngay lập tức.</p>
        </div>
        <div className='w-full h-16 mt-5 flex items-center justify-center border-t-[1px] border-[#333333a1] '>
            <p>© 2023 - Made with </p>
        </div>
    </div>
  )
}

export default Footer