import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
    const [payment, setPayment] = useState("cod");
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        ward: "",
        district: "",
        city: "",
        zipcode: "",
        phone: ""
    });

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, currency, deliveryCharge } = useContext(StoreContext);
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const placeOrder = async (e) => {
        e.preventDefault();
        let orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item };
                itemInfo.quantity = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        });

        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + deliveryCharge,
        };

        try {
            let response;
            if (payment === "stripe") {
                response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });
                if (response.data.success) {
                    const { session_url } = response.data;
                    window.location.replace(session_url);
                } else {
                    toast.error(response.data.message || "Lỗi khi đặt hàng");
                }
            } else {
                response = await axios.post(`${url}/api/order/placecod`, orderData, { headers: { token } });
                if (response.data.success) {
                    navigate("/myorders");
                    toast.success(response.data.message);
                    setCartItems({});
                } else {
                    toast.error(response.data.message || "Lỗi khi đặt hàng");
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi đặt hàng");
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error("Vui lòng đăng nhập để đặt hàng");
            navigate('/cart');
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token, navigate, getTotalCartAmount]);

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Thông Tin Giao Hàng</p>
                <div className="multi-field">
                    <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='Họ' required />
                    <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Tên' required />
                </div>
                <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email' required />
                <input type="text" name='address' onChange={onChangeHandler} value={data.address} placeholder='Địa Chỉ' required />
                <div className="multi-field">
                    <input type="text" name='ward' onChange={onChangeHandler} value={data.ward} placeholder='Phường' />
                    <input type="text" name='district' onChange={onChangeHandler} value={data.district} placeholder='Quận' />
                </div>
                <div className="multi-field">
                    <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='Thành Phố' required />
                    <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Mã Zip' required />
                </div>
                <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Điện Thoại' required />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Thanh Toán</h2>
                    <div>
                        <div className="cart-total-details"><p>Tổng giá trị</p><p>{currency}{getTotalCartAmount()}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Phí vận chuyển</p><p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Tổng đơn hàng</b><b>{currency}{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryCharge}</b></div>
                    </div>
                </div>
                <div className="payment">
                    <h2>Phương Thức Thanh Toán</h2>
                    <div onClick={() => setPayment("cod")} className="payment-option">
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                        <p>COD ( Thanh toán khi nhận hàng )</p>
                    </div>
                    <div onClick={() => setPayment("stripe")} className="payment-option">
                        <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
                        <p>BANK ( Thanh toán trực tuyến )</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>{payment === "cod" ? "Đặt hàng" : "Tiến hành thanh toán"}</button>
            </div>
        </form>
    );
};

export default PlaceOrder;