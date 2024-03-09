import React, {useEffect,useState} from 'react';
import { Tooltip,Row,Col} from 'antd';
import "../HomeComponent/style.css"
import { Link } from 'react-router-dom';
import axios from 'axios';


const theloai =  [  "Fantasy",  "Học đường",  "Trinh thám",  "Kỳ bí",  "Fantasy",  "Phiêu lưu",  "Romance",  "Huyền bí",  "Science Fiction",  "Hành động",  "Dystopian",  "Phiêu lưu",  "Adventure",  "Hành động",  "Mystery",  "Kỳ bí",  "Science Fiction",  "Action",  "Science Fiction",  "Adventure",  "War",  "Action",  "Historical Fiction",  "Hành động",  "Mystery",  "Adventure",  "Historical Fiction",  "Drama",  "Science Fiction",  "Dystopian",  "Adventure",  "Survival",  "Adventure",  "Survival",  "Mystery",  "Adventure"]


const rating = [
  "Top ngày",
  "Top tuần",
  "Top tháng",
  "Được yêu thích",
]
const TooltipComponent = ({sx}) => {

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
  return (
    
    <Tooltip placement="bottom" className=''>
        {sx?
        <>
          <div className='w-[736px] '>
            <Row justify="center" gutter={[8, 12]}>
                {genres?.items.map((item,index)=>{
                  return(
                        <Col key={index} span={6} >
                           <Link to={`/category/${item.slug}`}>
                              <p className='text2 hover:text-gray-500'>{item.name} </p>
                           </Link>
                        </Col> 
                        )
                })}
            </Row>

          </div>
        </>
        
        :
        <div className='w-60 '>
        <Row gutter={[8, 16]} >
            {rating.map((item,index)=>{
              return(
                    <Col span={24} ><p className='text2 hover:text-gray-500 hover:bg-gray-100'>{item} </p></Col> 
                    )
            })}
        </Row>

      </div>
        }
    </Tooltip>
  )
}

export default TooltipComponent