import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';
import Modal from 'react-modal';

// Gắn Modal vào app element (cần thiết cho react-modal)
Modal.setAppElement('#root');

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchAllOrders = async () => {
        try {
            const response = await axios.get(`${url}/api/order/list`);
            if (response.data.success) {
                setOrders(response.data.data.reverse());
            } else {
                toast.error("Lỗi khi tải danh sách đơn hàng");
            }
        } catch (error) {
            toast.error("Lỗi khi tải danh sách đơn hàng");
        }
    };

    const statusHandler = async (event, orderId) => {
        try {
            const response = await axios.post(`${url}/api/order/status`, { orderId, status: event.target.value });
            if (response.data.success) {
                await fetchAllOrders();
            } else {
                toast.error("Lỗi khi cập nhật trạng thái đơn hàng");
            }
        } catch (error) {
            toast.error("Lỗi khi cập nhật trạng thái đơn hàng");
        }
    };

    const formatDate = (date) => {
        return date ? new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "Không có thông tin";
    };

    const openDetailsModal = (order) => setSelectedOrder(order);
    const closeDetailsModal = () => setSelectedOrder(null);

    useEffect(() => {
        fetchAllOrders();
    }, []);

    return (
        <div className='order add'>
            <h3>Danh sách đơn hàng</h3>
            <div className="order-list">
                {orders.map((order, index) => (
                    <div key={index} className='order-item'>
                        <img src={assets.parcel_icon} alt="Parcel Icon" />
                        <div className="order-item-info">
                            <p className='order-item-name'>{order.address.firstName} {order.address.lastName}</p>
                            <div className='order-item-address'>
                                <p>{order.address.address},</p>
                                <p>{order.address.city}, P.{order.address.ward}, Q.{order.address.district}, {order.address.zipcode}</p>
                            </div>
                            <p className='order-item-phone'>{order.address.phone}</p>
                        </div>
                        <div className="order-item-payment">
                            <p>COD</p>
                            <p className="order-item-date"><b>Ngày đặt:</b> {formatDate(order.date)}</p>
                        </div>
                        <div className="order-item-amount">
                            <p>{currency}{order.amount}</p>
                            <p className="order-item-details-link" onClick={() => openDetailsModal(order)}>
                                Xem chi tiết
                            </p>
                        </div>
                        <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
                            <option value="Chuẩn bị đơn hàng">Chuẩn bị đơn hàng</option>
                            <option value="Đang giao hàng">Đang giao hàng</option>
                            <option value="Đã giao">Đã giao</option>
                        </select>
                    </div>
                ))}
            </div>

            {/* Popup chi tiết hóa đơn */}
            {selectedOrder && (
                <Modal
                    isOpen={!!selectedOrder}
                    onRequestClose={closeDetailsModal}
                    className="order-details-modal"
                    overlayClassName="order-details-modal-overlay"
                    contentLabel="Chi tiết hóa đơn"
                >
                    <div className="modal-header">
                        <button className="modal-close-btn" onClick={closeDetailsModal}>✖</button>
                        <div className="modal-header-content">
                            <h2>Chi Tiết Hóa Đơn</h2>
                            <div className="modal-order-info">
                                <p>Ngày mua: {formatDate(selectedOrder.date)}</p>
                                <p>Trạng thái: {selectedOrder.status || "Không xác định"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="modal-customer-info">
                        <p><b>Tên khách hàng:</b> {selectedOrder.address.firstName || ""} {selectedOrder.address.lastName || ""}</p>
                        <p><b>Địa chỉ:</b> {`${selectedOrder.address.address || ""}, ${selectedOrder.address.city || ""}, P.${selectedOrder.address.ward || ""}, Q.${selectedOrder.address.district || ""}, ${selectedOrder.address.zipcode || ""}`}</p>
                        <p><b>Điện thoại:</b> {selectedOrder.address.phone || "Không có thông tin"}</p>
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
                    <div className="modal-buttons">
                        <button className="modal-cancel-btn" onClick={closeDetailsModal}>Hủy</button>
                        <div className="modal-action-buttons">
                            <button className="modal-print-btn">In hóa đơn</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Order;