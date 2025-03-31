import React, { useContext, useState } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const FoodItem = ({ image, name, price, desc, id }) => {
    const navigate = useNavigate();
    const [itemCount, setItemCount] = useState(0);
    const { cartItems, addToCart, removeFromCart, url, currency } = useContext(StoreContext);

    // Hàm ngăn chặn sự kiện lan truyền khi bấm vào nút thêm số lượng
    const handleStopPropagation = (e) => {
        e.stopPropagation(); // Ngăn sự kiện click lan truyền lên div cha
    };

    // Hàm xử lý chuyển hướng khi bấm vào hình ảnh
    const handleImageClick = (e) => {
        navigate(`/food/${id}`); // Chuyển hướng đến trang chi tiết
    };

    return (
        <div className='food-item' onClick={() => navigate(`/food/${id}`)}>
            <div className='food-item-img-container' onClick={handleStopPropagation}>
                <img className='food-item-image' src={url + "/images/" + image} alt="" onClick={handleImageClick} style={{ cursor: 'pointer' }} />
                {!cartItems[id] ? (
                    <img className='add' onClick={(e) => { handleStopPropagation(e); addToCart(id); }} src={assets.add_icon_white} alt="" /> ) : (
                    <div className="food-item-counter">
                        <img src={assets.remove_icon_red} onClick={(e) => { handleStopPropagation(e); removeFromCart(id); }} alt=""/>
                        <p>{cartItems[id]}</p>
                        <img src={assets.add_icon_green} onClick={(e) => { handleStopPropagation(e); addToCart(id); }} alt="" />
                    </div>
                )}
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p> <img src={assets.rating_starts} alt="" />
                </div>
                <p className="food-item-desc">{desc}</p>
                <p className="food-item-price">{currency}{price}</p>
            </div>
        </div>
    );
};

export default FoodItem;