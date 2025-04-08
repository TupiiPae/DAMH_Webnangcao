import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';

const Order = () => {
    const [orders, setOrders] = useState([]);

    const fetchAllOrders = async () => {
        const response = await axios.get(`${url}/api/order/list`);
        if (response.data.success) {
            setOrders(response.data.data.reverse());
        } else {
            toast.error("Error");
        }
    };

    const statusHandler = async (event, orderId) => {
        const response = await axios.post(`${url}/api/order/status`, {
            orderId,
            status: event.target.value,
        });
        if (response.data.success) {
            await fetchAllOrders();
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <div className='order add'>
            <h3>Danh sách đơn hàng</h3>
            <div className="order-list">
                {orders.map((order, index) => (
                    <div key={index} className='order-item'>
                        <img src={assets.parcel_icon} alt="" />
                        <div className="order-item-info">
                            <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
                            <div className='order-item-address'>
                                <p>{order.address.address + ","}</p>
                                <p>{order.address.city + ", " + "P." + order.address.ward + ", " + "Q." + order.address.district + ", " + order.address.zipcode}</p>
                            </div>
                            <p className='order-item-phone'>{order.address.phone}</p>
                        </div>
                        <div className="order-item-payment">
                            <p>COD</p>
                            <p className="order-item-date"><b>Ngày đặt:</b> {order.date ? formatDate(order.date) : "Không có thông tin"}</p>
                        </div>
                        <div className="order-item-amount">
                            <p>{currency}{order.amount}</p>
                            <div className="order-item-products">
                                <ul>
                                    {order.items && order.items.length > 0 ? (
                                        order.items.map((item, idx) => (
                                            <li key={idx} className="order-product-item">
                                                <div className="order-product-details">
                                                    <span>{item.name || "Không có tên"}</span>
                                                </div>
                                                <div className="order-product-details">
                                                    <span>{item.gender || "Không có tên"}</span>
                                                </div>
                                                <div className="order-product-details">
                                                    <span>Số lượng: {item.quantity || 0}</span>
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <li>Không có sản phẩm</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <select onChange={(e) => statusHandler(e, order._id)} value={order.status} name="" id="">
                            <option value="Chuẩn bị đơn hàng">Chuẩn bị đơn hàng</option>
                            <option value="Đang giao hàng">Đang giao hàng</option>
                            <option value="Đã giao">Đã giao</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Order;