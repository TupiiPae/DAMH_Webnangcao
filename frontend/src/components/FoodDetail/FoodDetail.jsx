import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './FoodDetail.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import { FaClock, FaVenusMars, FaBox } from 'react-icons/fa'; // Import icon từ react-icons

const FoodDetail = () => {
    const { id } = useParams();
    const { food_list, addToCart, removeFromCart, cartItems, url, currency } = useContext(StoreContext);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const foodItem = food_list.find(item => item._id === id);

    if (!foodItem) {
        return <p>Không tìm thấy sản phẩm!</p>;
    }

    const handleStopPropagation = (e) => {
        e.stopPropagation();
    };

    const handleAddToCart = () => {
        if (cartItems[id] >= foodItem.quantity) {
            toast.error("Đã đạt số lượng tối đa trong kho!");
            return;
        }
        addToCart(id);
    };

    return (
        <div className="food-detail">
            <div className="food-detail-image">
                <img src={`${url}/images/${foodItem.image}`} alt={foodItem.name} />
            </div>
            <div className="food-detail-info">
                <h1>{foodItem.name}</h1>
                <p className="food-detail-price">{foodItem.price}{currency}</p>
                <div className="food-detail-desc-box">
                    <p className="food-detail-desc">{foodItem.description}</p>
                </div>
                <div className="food-detail-extra">
                    <div className="food-detail-box food-detail-age">
                        <FaClock className="detail-icon" />
                        <span>Tuổi: {foodItem.age} tháng</span>
                    </div>
                    <div className="food-detail-box food-detail-gender">
                        <FaVenusMars className="detail-icon" />
                        <span>Giới tính: {foodItem.gender}</span>
                    </div>
                    <div className="food-detail-box food-detail-quantity">
                        <FaBox className="detail-icon" />
                        <span>Số lượng: {foodItem.quantity}</span>
                    </div>
                </div>
                <div className="food-detail-actions">
                    {!cartItems[id] ? (
                        <img
                            className="add-to-cart-btn"
                            onClick={handleAddToCart}
                            src={assets.add_icon_white}
                            alt="Add to cart"
                        />
                    ) : (
                        <div className="food-detail-counter">
                            <img
                                src={assets.remove_icon_red}
                                onClick={() => removeFromCart(id)}
                                alt="Remove from cart"
                            />
                            <span>{cartItems[id]}</span>
                            <img
                                src={assets.add_icon_green}
                                onClick={handleAddToCart}
                                alt="Add more"
                            />
                        </div>
                    )}
                    <a href="#" onClick={() => window.history.back()} className="continue-shopping-btn">
                        Tiếp tục mua hàng
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FoodDetail;