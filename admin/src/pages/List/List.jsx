import React, { useEffect, useState } from 'react';
import './List.css';
import { url, currency } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const List = () => {
    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [foodIdToDelete, setFoodIdToDelete] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchList = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${url}/api/food/list`);
            if (response.data.success) {
                setList(response.data.data);
                setFilteredList(response.data.data);
            } else {
                toast.error(response.data.message || "Lỗi khi tải danh sách thú cưng");
            }
        } catch (error) {
            toast.error(error.message || "Lỗi khi tải danh sách thú cưng");
        } finally {
            setLoading(false);
        }
    };

    const openDeleteModal = (foodId) => {
        setFoodIdToDelete(foodId);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false);
        setFoodIdToDelete(null);
    };

    const confirmDelete = async () => {
        if (!foodIdToDelete) return;

        try {
            const response = await axios.post(`${url}/api/food/remove`, { id: foodIdToDelete });
            if (response.data.success) {
                toast.success(response.data.message);
                await fetchList();
            } else {
                toast.error(response.data.message || "Lỗi khi xóa thú cưng");
            }
        } catch (error) {
            toast.error(error.message || "Lỗi khi xóa thú cưng");
        } finally {
            closeDeleteModal();
        }
    };

    const editFood = (foodId) => {
        if (!foodId || !/^[0-9a-fA-F]{24}$/.test(foodId)) {
            toast.error("ID sản phẩm không hợp lệ");
            return;
        }
        navigate(`/edit-food/${foodId}`);
    };

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
        let filtered = list;
        
        if (category) {
            filtered = list.filter(item => item.category === category);
        }
        
        if (searchTerm) {
            filtered = filtered.filter(item => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        setFilteredList(filtered);
        setIsFilterOpen(false);
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            let filtered = list;
            
            if (searchTerm) {
                filtered = list.filter(item => 
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            
            if (selectedCategory) {
                filtered = filtered.filter(item => item.category === selectedCategory);
            }
            
            setFilteredList(filtered);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        let filtered = list;
        
        if (selectedCategory) {
            filtered = list.filter(item => item.category === selectedCategory);
        }
        
        setFilteredList(filtered);
    };

    const categories = [...new Set(list.map(item => item.category))];

    useEffect(() => {
        fetchList();
    }, []);

    if (loading) {
        return <div className='list add flex-col'>Đang tải danh sách thú cưng...</div>;
    }

    return (
        <div className='list add flex-col'>
            <p>Danh sách thú cưng</p>
            <div className='list-controls'>
                <div className='filter-container'>
                    <button onClick={toggleFilter} className='filter-btn'>
                        Lọc danh mục {selectedCategory && `(${selectedCategory})`}
                    </button>
                    {isFilterOpen && (
                        <div className='filter-dropdown'>
                            <button onClick={() => handleCategoryFilter('')}>Tất cả</button>
                            {categories.map((category, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => handleCategoryFilter(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className='search-container'>
                    <input
                        type='text'
                        placeholder='Tìm kiếm thú cưng...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleSearch}
                        className='search-input'
                    />
                    {searchTerm && (
                        <button onClick={clearSearch} className='clear-btn'>
                            ✕
                        </button>
                    )}
                </div>
            </div>
            <div className='list-table'>
                <div className="list-table-format title">
                    <b>Hình ảnh</b>
                    <b>Thú cưng</b>
                    <b>Danh mục</b>
                    <b>Giới tính</b>
                    <b>Số lượng</b>
                    <b>Giá</b>
                    <b>Hành động</b>
                </div>
                {filteredList.map((item, index) => (
                    <div key={index} className='list-table-format' onClick={() => editFood(item._id)}>
                        <img src={`${url}/images/${item.image}`} alt={item.name} />
                        <p>{item.name}</p>
                        <p>{item.category}</p>
                        <p>{item.gender || 'N/A'}</p>
                        <p>{item.quantity || 0}</p>
                        <p>{item.price}{currency}</p>
                        <p
                            className='cursor'
                            onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(item._id);
                            }}
                        >
                            x
                        </p>
                    </div>
                ))}
            </div>

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