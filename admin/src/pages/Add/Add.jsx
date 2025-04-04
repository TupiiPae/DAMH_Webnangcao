import React, { useState } from 'react'
import './Add.css'
import { assets, url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = () => {


    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Chó"
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
        formData.append("image", image);
        const response = await axios.post(`${url}/api/food/add`, formData);
        if (response.data.success) {
            toast.success(response.data.message)
            setData({
                name: "",
                description: "",
                price: "",
                category: data.category
            })
            setImage(false);
        }
        else {
            toast.error(response.data.message)
        }
    }

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

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
                    <textarea name='description' onChange={onChangeHandler} value={data.description} type="text" rows={6} placeholder='Nhập mô tả' required />
                </div>
                <div className='add-category-price'>
                    <div className='add-category flex-col'>
                        <p>Danh mục</p>
                        <select name='category' onChange={onChangeHandler} >
                            <option value="Chó">Chó</option>
                            <option value="Mèo">Mèo</option>
                            <option value="Chuột">Chuột</option>
                            <option value="Sóc">Sóc</option>
                            <option value="Thỏ">Thỏ</option>
                            <option value="Nhím">Nhím</option>
                            <option value="Rùa">Rùa</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                    <div className='add-price flex-col'>
                        <p>Giá</p>
                        <input type="Number" name='price' onChange={onChangeHandler} value={data.price} placeholder='1.500.000' />
                    </div>
                </div>
                <button type='submit' className='add-btn' >Thêm</button>
            </form>
        </div>
    )
}

export default Add
