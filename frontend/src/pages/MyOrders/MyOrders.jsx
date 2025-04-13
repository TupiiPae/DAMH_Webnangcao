import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import Modal from 'react-modal';

// Gắn Modal vào app element (cần thiết cho react-modal)
Modal.setAppElement('#root');

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

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatAddress = (address) => {
        if (!address) return "Không có thông tin địa chỉ";
        const { address: street, ward, district, city, zipcode } = address;
        return `${street || ""}, ${city || ""}, P.${ward || ""}, Q.${district || ""}, ${zipcode || ""}`.replace(/,\s*,/g, ',').replace(/,\s*$/, '');
    };

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
                        <button onClick={() => setSelectedOrder(order)}>Theo dõi đơn hàng</button>
                    </div>
                ))}
            </div>

            {/* Popup chi tiết đơn hàng */}
            {selectedOrder && (
                <Modal
                    isOpen={!!selectedOrder}
                    onRequestClose={() => setSelectedOrder(null)}
                    className="order-details-modal"
                    overlayClassName="order-details-modal-overlay"
                    contentLabel="Chi tiết đơn hàng"
                >
                    <div className="modal-header">
                        <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>✖</button>
                        <div className="modal-header-content">
                            <h2>Chi Tiết Đơn Hàng</h2>
                            <div className="modal-order-info">
                                <p>Ngày mua: {selectedOrder.date ? formatDate(selectedOrder.date) : "Không có thông tin"}</p>
                                <p>Trạng thái: {selectedOrder.status || "Không xác định"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="modal-customer-info">
                        <p><b>Tên khách hàng:</b> {getFullName(selectedOrder.address)}</p>
                        <p><b>Địa chỉ:</b> {formatAddress(selectedOrder.address)}</p>
                        <p><b>Điện thoại:</b> {selectedOrder.address?.phone || "Không có thông tin"}</p>
                        <p><b>Quốc gia:</b> Việt Nam</p>
                    </div>
                    <div className="modal-payment-info">
                        <p><b>Hình thức thanh toán:</b> COD</p>
                        <p><b>Phí giao hàng:</b> 30,000 VND</p>
                    </div>
                    <div className="modal-products">
                        <table className="modal-products-table">
                            <thead>
                                <tr>
                                    <th>Thú cưng</th>
                                    <th>Danh mục</th>
                                    <th>Giới tính</th>
                                    <th>Số lượng</th>
                                    <th>Giá</th>
                                    <th>Tổng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.items?.length > 0 ? (
                                    selectedOrder.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{item.name || "Không có tên"}</td>
                                            <td>{item.category || "Không xác định"}</td>
                                            <td>{item.gender || "Không xác định"}</td>
                                            <td>{item.quantity || 0}</td>
                                            <td>{currency}{item.price || 0}</td>
                                            <td>{currency}{(item.price * item.quantity) || 0}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">Không có sản phẩm</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="modal-total">
                            <p><b>Tổng cộng:</b> {currency}{selectedOrder.amount || 0}</p>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default MyOrders;