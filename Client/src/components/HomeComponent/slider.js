import React from 'react'
import { Carousel } from 'antd';


const Slider = () => {

    const onChange = (currentSlide) => {
        console.log(currentSlide);
      };
  return (
   
    <Carousel afterChange={onChange} >
        <div>
            <img  src='https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf' alt='anh'></img>

        </div>
        <div>
            <img  src='https://t4.ftcdn.net/jpg/04/46/93/93/360_F_446939375_83iP0UYTg5F9vHl6icZwgrEBHXeXMVaU.jpg' alt='anh'></img>
        </div>
        <div>
            <img  src='https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf' alt='anh'></img>
        </div>
        <div>
            <img   src='https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?auto=webp&s=8b871c713fdb41aaf0c08702857ba0e8464534cf' alt='anh'></img>
        </div>
    </Carousel>
    
  )
}

export default Slider