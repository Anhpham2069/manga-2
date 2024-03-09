import React,{useState} from 'react'
import HeaderAdmin from './components/header'
import SideBarAdmin from './components/SideBar'
import FooterAdmin from './components/footer'
import ContentAdmin from './components/contentAdmin'

const AdminLayout = () => {
    const [selectedItem, setSelectedItem] = useState(1);

    const handleItemClick = (item) => {
      setSelectedItem(item);
    };
  return (
    <div className='flex-col justify-between full'>
        <HeaderAdmin />
        <div className='flex flex-1'>
            <div className='w-[15%] text-3xl font-semibold '>
                <SideBarAdmin onItemClick={handleItemClick}/>
            </div>
            <div className='flex-1 p-5 h-full'>
             <ContentAdmin selectedItem={selectedItem} />
            </div>
            {/* <ContentAdmin /> */}
        </div>
        <FooterAdmin />
    </div>
  )
}

export default AdminLayout