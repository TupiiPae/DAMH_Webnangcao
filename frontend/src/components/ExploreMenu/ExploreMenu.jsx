import React, { useContext } from 'react'
import './ExploreMenu.css'
import { StoreContext } from '../../Context/StoreContext'

const ExploreMenu = ({category,setCategory}) => {

  const {menu_list} = useContext(StoreContext);
  
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Khám phá cửa hàng của chúng tôi</h1>
      <p className='explore-menu-text'>Khám phá các loài thú cưng dễ thương. Chúng tôi cam kết mang đến cho bạn những người bạn bốn chân siêu đáng yêu. Mỗi chú thú cưng đều được chăm sóc tỉ mỉ, sẵn sàng trở thành người bạn thân thiết đồng hành cùng bạn.</p>
      <div className="explore-menu-list">
        {menu_list.map((item,index)=>{
            return (
                <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={index} className='explore-menu-list-item'>
                    <img src={item.menu_image} className={category===item.menu_name?"active":""} alt="" />
                    <p>{item.menu_name}</p>
                </div>
            )
        })}
      </div>
      <hr />
    </div>
  )
}

export default ExploreMenu
