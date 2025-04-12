import React, { useEffect, useState } from 'react';
import './Edit.css';
import { url, currency } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from 'react-modal';

// Gắn Modal vào app element (cần thiết cho react-modal)
Modal.setAppElement('#root');

const Edit = () => {
    const [image, setImage] = useState(null);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        age: "",
        gender: "",
        quantity: "",
    });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // State để quản lý trạng thái popup xóa

    const navigate = useNavigate();
    const { id } = useParams();

    const fetchFood = async () => {
        try {
            if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
                toast.error("ID sản phẩm không hợp lệ");
                navigate('/list');
                return;
            }

            console.log("Fetching food with ID:", id);
            const response = await axios.get(`${url}/api/food/${id}`);
            console.log("API response:", response.data);

            if (response.data.success) {
                const food = response.data.data;
                if (!food || !food.name) {
                    throw new Error("Dữ liệu sản phẩm không hợp lệ");
                }

                setData({
                    name: food.name || "",
                    description: food.description || "",
                    price: food.price || "",
                    category: food.category || "",
                    age: food.age || "",
                    gender: food.gender || "",
                    quantity: food.quantity || "",
                });
                setImage(food.image || null);
                setLoading(false);
            } else {
                toast.error(response.data.message || "Không thể tải thông tin sản phẩm");
                navigate('/list');
            }
        } catch (error) {
            console.error("Error fetching food:", error.message);
            if (error.response && error.response.status === 404) {
                toast.error("API không tồn tại. Vui lòng kiểm tra backend.");
            } else {
                toast.error(error.message || "Lỗi khi tải thông tin sản phẩm");
            }
            navigate('/list');
        }
    };

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData((data) => ({ ...data, [name]: value }));
    };

    const onImageChangeHandler = (event) => {
        setImage(event.target.files[0]);
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("id", id);
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("category", data.category);
        formData.append("age", data.age);
        formData.append("gender", data.gender);
        formData.append("quantity", data.quantity);
        if (image instanceof File) {
            formData.append("image", image);
        }

        try {
            const response = await axios.post(`${url}/api/food/update`, formData);
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/list');
            } else {
                toast.error(response.data.message || "Lỗi khi cập nhật sản phẩm");
            }
        } catch (error) {
            console.error("Error updating food:", error.message);
            toast.error(error.message || "Lỗi khi cập nhật sản phẩm");
        }
    };

    const openDeleteModal = () => {
        setIsModalOpen(true); // Mở popup xác nhận xóa
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false); // Đóng popup
    };

    const confirmDelete = async () => {
        try {
            const response = await axios.post(`${url}/api/food/remove`, { id });
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/list'); // Chuyển hướng về danh sách sau khi xóa
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

    useEffect(() => {
        fetchFood();
    }, [id]);

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
        <div className='edit'>
            <form className="flex-col" onSubmit={onSubmitHandler}>
                <div className="edit-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img
                            src={image ? (image instanceof File ? URL.createObjectURL(image) : `${url}/images/${image}`) : `${url}/images/placeholder.jpg`}
                            alt=""
                        />
                    </label>
                    <input onChange={onImageChangeHandler} type="file" id="image" hidden />
                </div>
                <div className="edit-product-name flex-col">
                    <p>Tên thú cưng</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Nhập tên thú cưng' required />
                </div>
                <div className="edit-product-description flex-col">
                    <p>Mô tả thú cưng</p>
                    <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Nhập mô tả' required></textarea>
                </div>
                <div className="edit-category-price">
                    <div className="edit-category flex-col">
                        <p>Danh mục</p>
                        <select onChange={onChangeHandler} value={data.category} name="category" required>
                            <option value="">Chọn danh mục</option>
                            <option value="Chó">Chó</option>
                            <option value="Mèo">Mèo</option>
                            <option value="Chuột">Chuột</option>
                            <option value="Bọ Ú">Bọ Ú</option>
                            <option value="Thỏ">Thỏ</option>
                            <option value="Sóc">Sóc</option>
                            <option value="Nhím">Nhím</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                    <div className="edit-price flex-col">
                        <p>Giá thú cưng</p>
                        <input onChange={onChangeHandler} value={data.price} type="number" min="0" name='price' placeholder='Nhập giá' required />
                    </div>
                </div>
                <div className="edit-age-gender">
                    <div className="edit-age flex-col">
                        <p>Tuổi (tháng)</p>
                        <input onChange={onChangeHandler} value={data.age} type="number" min="0" name='age' placeholder='Nhập tuổi' required />
                    </div>
                    <div className="edit-gender flex-col">
                        <p>Giới tính</p>
                        <select onChange={onChangeHandler} value={data.gender} name="gender" required>
                            <option value="Đực">Đực</option>
                            <option value="Cái">Cái</option>
                        </select>
                    </div>
                </div>
                <div className="edit-quantity flex-col">
                    <p>Số lượng</p>
                    <input onChange={onChangeHandler} value={data.quantity} type="number" min="0" name='quantity' placeholder='Nhập số lượng' required />
                </div>
                <div className="edit-buttons">
                    <button type='submit' className='edit-btn'>Cập nhật</button>
                    <button type='button' className='delete-btn' onClick={openDeleteModal}>Xóa</button>
                </div>
            </form>

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

export default Edit;