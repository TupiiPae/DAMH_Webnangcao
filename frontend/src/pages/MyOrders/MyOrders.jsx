import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const [data, setData] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { url, token, currency } = useContext(StoreContext);

    const fetchOrders = async () => {
        const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
        setData(response.data.data);
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    const showOrderDetails = (order) => {
        setSelectedOrder(order);
    };

    const closePopup = () => {
        setSelectedOrder(null);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // Hàm kiểm tra và hiển thị địa chỉ
    const formatAddress = (address) => {
        if (!address) return "Không có thông tin địa chỉ";
        const { address: street, ward, district, city, zipcode } = address;
        const addressParts = [street, ward, district, city, zipcode].filter(part => part);
        return addressParts.length > 0 ? addressParts.join(', ') : "Không có thông tin địa chỉ";
    };

    // Hàm lấy tên đầy đủ
    const getFullName = (address) => {
        if (!address) return "Không có thông tin";
        const { firstName, lastName } = address;
        return [firstName, lastName].filter(part => part).join(' ') || "Không có thông tin";
    };

    return (
        <div className='my-orders'>
            <p>Đơn hàng của tôi</p>
            <div className="container">
                {data.map((order, index) => (
                    <div key={index} className='my-orders-order'>
                        <img src={assets.parcel_icon} alt="" />
                        <p>
                            {order.items.map((item, idx) =>
                                idx === order.items.length - 1
                                    ? `${item.name} x ${item.quantity}`
                                    : `${item.name} x ${item.quantity}, `
                            )}
                        </p>
                        <p>{order.amount}{currency}</p>
                        <p>COD</p>
                        <p><span>●</span> <b>{order.status}</b></p>
                        <button onClick={() => showOrderDetails(order)}>Theo dõi đơn hàng</button>
                    </div>
                ))}
            </div>

            {/* Popup hiển thị chi tiết đơn hàng */}
            {selectedOrder && (
                <div className="order-popup">
                    <div className="order-popup-content">
                        <h3>Chi tiết đơn hàng</h3>
                        <div className="order-popup-main">
                            {/* Bên trái: Thông tin sản phẩm */}
                            <div className="order-popup-left">
                                <h4>Sản phẩm:</h4>
                                <ul>
                                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                        selectedOrder.items.map((item, idx) => (
                                            <li key={idx} className="order-item">
                                                <div className="order-item-details">
                                                    <span>{item.name || "Không có tên"}</span>
                                                    <span> - Số lượng: {item.quantity || 0}</span>
                                                    <span> - Giá: {item.price ? `${item.price}${currency}` : "Không có giá"}</span>
                                                </div>
                                                {item.image && (
                                                    <img
                                                        src={`${url}/images/${item.image}`}
                                                        alt={item.name || "Sản phẩm"}
                                                        className="order-item-image"
                                                    />
                                                )}
                                            </li>
                                        ))
                                    ) : (
                                        <li>Không có sản phẩm</li>
                                    )}
                                </ul>
                            </div>

                            {/* Bên phải: Thời gian và thông tin giao hàng */}
                            <div className="order-popup-right">
                                <h4>Thông tin giao hàng:</h4>
                                <p><b>Ngày đặt hàng:</b> {selectedOrder.date ? formatDate(selectedOrder.date) : "Không có thông tin"}</p>
                                <p><b>Tên người nhận:</b> {getFullName(selectedOrder.address)}</p>
                                <p><b>Email:</b> {selectedOrder.address?.email || "Không có thông tin"}</p>
                                <p><b>Địa chỉ:</b> {formatAddress(selectedOrder.address)}</p>
                                <p><b>Điện thoại:</b> {selectedOrder.address?.phone || "Không có thông tin"}</p>
                            </div>
                        </div>

                        {/* Bên dưới: Số tiền và thông tin giao dịch */}
                        <div className="order-popup-bottom">
                            <p><b>Tổng tiền:</b> {selectedOrder.amount ? `${selectedOrder.amount}${currency}` : "Không có thông tin"}</p>
                            <p><b>Phương thức thanh toán:</b> Thanh toán khi nhận hàng (COD)</p>
                            <p><b>Trạng thái:</b> {selectedOrder.status || "Không có thông tin"}</p>
                        </div>

                        <button className="close-popup-btn" onClick={closePopup}>Đóng</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;