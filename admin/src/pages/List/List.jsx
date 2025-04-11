import React, { useEffect, useState } from 'react';
import './List.css';
import { url, currency } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

// Gắn Modal vào app element (cần thiết cho react-modal)
Modal.setAppElement('#root');

const List = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // State để quản lý trạng thái popup
    const [foodIdToDelete, setFoodIdToDelete] = useState(null); // Lưu ID của sản phẩm cần xóa
    const navigate = useNavigate();

    const fetchList = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${url}/api/food/list`);
            console.log("Fetch list response:", response.data);
            if (response.data.success) {
                setList(response.data.data);
            } else {
                toast.error(response.data.message || "Lỗi khi tải danh sách thú cưng");
            }
        } catch (error) {
            console.error("Error fetching list:", error.message);
            toast.error(error.message || "Lỗi khi tải danh sách thú cưng");
        } finally {
            setLoading(false);
        }
    };

    const openDeleteModal = (foodId) => {
        setFoodIdToDelete(foodId); // Lưu ID của sản phẩm cần xóa
        setIsModalOpen(true); // Mở popup
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false); // Đóng popup
        setFoodIdToDelete(null); // Xóa ID
    };

    const confirmDelete = async () => {
        if (!foodIdToDelete) return;

        try {
            const response = await axios.post(`${url}/api/food/remove`, { id: foodIdToDelete });
            if (response.data.success) {
                toast.success(response.data.message);
                await fetchList(); // Cập nhật danh sách sau khi xóa
            } else {
                toast.error(response.data.message || "Lỗi khi xóa thú cưng");
            }
        } catch (error) {
            console.error("Error removing food:", error.message);
            toast.error(error.message || "Lỗi khi xóa thú cưng");
        } finally {
            closeDeleteModal(); // Đóng popup sau khi xử lý
        }
    };

    const editFood = (foodId) => {
        if (!foodId || !/^[0-9a-fA-F]{24}$/.test(foodId)) {
            toast.error("ID sản phẩm không hợp lệ");
            return;
        }
        console.log("Navigating to edit with ID:", foodId);
        navigate(`/edit-food/${foodId}`);
    };

    useEffect(() => {
        fetchList();
    }, []);

    if (loading) {
        return <div className='list add flex-col'>Đang tải danh sách thú cưng...</div>;
    }

    if (list.length === 0) {
        return (
            <div className='list add flex-col'>
                <p>Danh sách thú cưng</p>
                <p>Không có thú cưng nào trong danh sách.</p>
            </div>
        );
    }

    return (
        <div className='list add flex-col'>
            <p>Danh sách thú cưng</p>
            <div className='list-table'>
                <div className="list-table-format title">
                    <b>Hình ảnh</b>
                    <b>Thú cưng</b>
                    <b>Danh mục</b>
                    <b>Giá</b>
                    <b>Hành động</b>
                </div>
                {list.map((item, index) => (
                    <div key={index} className='list-table-format' onClick={() => editFood(item._id)}>
                        <img src={`${url}/images/` + item.image} alt={item.name} />
                        <p>{item.name}</p>
                        <p>{item.category}</p>
                        <p>{item.price}{currency}</p>
                        <p
                            className='cursor'
                            onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(item._id); // Mở popup xác nhận xóa
                            }}
                        >
                            x
                        </p>
                    </div>
                ))}
            </div>

            {/* Popup xác nhận xóa */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeDeleteModal}
                className="delete-modal"
                overlayClassName="delete-modal-overlay"
                contentLabel="Xác nhận xóa thú cưng"
            >
                <h2>Xác nhận xóa</h2>
                <p>Bạn có chắc chắn muốn xóa thú cưng này không?</p>
                <div className="modal-buttons">
                    <button onClick={confirmDelete} className="modal-confirm-btn">Xác nhận</button>
                    <button onClick={closeDeleteModal} className="modal-cancel-btn">Hủy</button>
                </div>
            </Modal>
        </div>
    );
};

export default List;