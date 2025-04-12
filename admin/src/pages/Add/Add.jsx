import React, { useState } from 'react';
import './Add.css';
import { assets, url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = () => {
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Chó",
        age: "",
        gender: "Đực",
        quantity: ""
    });

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!image) {
            toast.error('Chưa chọn hình ảnh');
            return null;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("age", data.age);
        formData.append("gender", data.gender);
        formData.append("quantity", Number(data.quantity));
        formData.append("image", image);

        const response = await axios.post(`${url}/api/food/add`, formData);
        if (response.data.success) {
            toast.success(response.data.message);
            setData({
                name: "",
                description: "",
                price: "",
                category: "Chó",
                age: "",
                gender: "Đực",
                quantity: ""
            });
            setImage(false);
        } else {
            toast.error(response.data.message);
        }
    };

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className='add-img-upload flex-col'>
                    <p>Thêm hình ảnh</p>
                    <input onChange={(e) => { setImage(e.target.files[0]); e.target.value = '' }} type="file" accept="image/*" id="image" hidden />
                    <label htmlFor="image">
                        <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" />
                    </label>
                </div>
                <div className='add-product-name flex-col'>
                    <p>Thú cưng</p>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Nhập ở đây' required />
                </div>
                <div className='add-product-description flex-col'>
                    <p>Mô tả</p>
                    <textarea name='description' onChange={onChangeHandler} value={data.description} rows={6} placeholder='Nhập mô tả' required />
                </div>
                <div className='add-extra-info'>
                    <div className='add-age flex-col'>
                        <p>Tuổi (tháng)</p>
                        <input type="number" name='age' min="0" onChange={onChangeHandler} value={data.age} placeholder='Ví dụ: 6' required />
                    </div>
                    <div className='add-gender flex-col'>
                        <p>Giới tính</p>
                        <select name='gender' onChange={onChangeHandler} value={data.gender}>
                            <option value="Đực">Đực</option>
                            <option value="Cái">Cái</option>
                        </select>
                    </div>
                </div>
                <div className='add-category-price'>
                    <div className='add-category flex-col'>
                        <p>Danh mục</p>
                        <select name='category' onChange={onChangeHandler} value={data.category}>
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
                    <div className='add-price flex-col'>
                        <p>Giá</p>
                        <input type="number" name='price' min="0" onChange={onChangeHandler} value={data.price} placeholder='10' required />
                    </div>
                    <div className='add-quantity flex-col'>
                        <p>Số lượng</p>
                        <input type="number" name='quantity' min="0" onChange={onChangeHandler} value={data.quantity} placeholder='1' required />
                    </div>
                </div>
                <button type='submit' className='add-btn'>Thêm</button>
            </form>
        </div>
    );
};

export default Add;