import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './FoodDetail.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets'; // Import assets để sử dụng hình ảnh

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

    // Hàm ngăn chặn sự kiện lan truyền (nếu cần trong tương lai)
    const handleStopPropagation = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="food-detail">
            <div className="food-detail-image">
                <img src={`${url}/images/${foodItem.image}`} alt={foodItem.name} />
            </div>
            <div className="food-detail-info">
                <h1>{foodItem.name}</h1>
                <p className="food-detail-desc">{foodItem.description}</p>
                <p className="food-detail-price">
                    <span className="discounted-price">{foodItem.price}{currency}</span>
                </p>
                <div className="food-detail-actions">
                    {!cartItems[id] ? (
                        <img
                            className="add-to-cart-btn"
                            onClick={() => addToCart(id)}
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
                                onClick={() => addToCart(id)}
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