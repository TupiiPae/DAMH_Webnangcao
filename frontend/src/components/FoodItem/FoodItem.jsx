import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const FoodItem = ({ image, name, price, desc, id, gender, quantity }) => {
    const navigate = useNavigate();
    const { cartItems, addToCart, removeFromCart, url, currency } = useContext(StoreContext);

    const handleStopPropagation = (e) => {
        e.stopPropagation();
    };

    const handleAddToCart = (e) => {
        handleStopPropagation(e);
        if (quantity === 0) {
            toast.error("Hết hàng!");
            return;
        }
        if (cartItems[id] >= quantity) {
            toast.error("Đã đạt số lượng tối đa trong kho!");
            return;
        }
        addToCart(id);
    };

    const handleImageClick = (e) => {
        e.stopPropagation();
        navigate(`/food/${id}`);
    };

    return (
        <div className='food-item' onClick={() => navigate(`/food/${id}`)}>
            <div className='food-item-img-container' onClick={handleStopPropagation}>
                <img
                    className='food-item-image'
                    src={url + "/images/" + image}
                    alt={name}
                    style={{ cursor: 'pointer' }}
                    onClick={handleImageClick}
                />
                {quantity === 0 ? (
                    <p className='out-of-stock'>Hết hàng</p>
                ) : !cartItems[id] ? (
                    <img
                        className='add'
                        onClick={handleAddToCart}
                        src={assets.add_icon_white}
                        alt="Add to cart"
                    />
                ) : (
                    <div className="food-item-counter">
                        <img
                            src={assets.remove_icon_red}
                            onClick={(e) => { handleStopPropagation(e); removeFromCart(id); }}
                            alt="Remove from cart"
                        />
                        <p>{cartItems[id]}</p>
                        <img
                            src={assets.add_icon_green}
                            onClick={handleAddToCart}
                            alt="Add more"
                        />
                    </div>
                )}
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="Rating" />
                </div>
                <p className="food-item-gender">Giới tính: {gender}</p>
                <div className="food-item-footer">
                    <p className="food-item-price">{price}{currency}</p>
                    <p className="food-item-quantity">Còn lại: {quantity}</p>
                </div>
            </div>
        </div>
    );
};

export default FoodItem;