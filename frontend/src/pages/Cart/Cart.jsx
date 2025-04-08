import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const {cartItems, food_list, removeFromCart, addToCart, getTotalCartAmount, url, currency, deliveryCharge, deleteFromCart} = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Hình ảnh</p> <p>Thú cưng</p> <p>Giá</p> <p>Số lượng</p> <p>Tổng</p> <p>Xóa</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id]>0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{item.price}{currency}</p>
                  <div className="cart-quantity-control">
                      <button onClick={() => addToCart(item._id)} className="plus">+</button>
                      <span className="quantity-display">{cartItems[item._id]}</span>
                      <button onClick={() => removeFromCart(item._id)} className="minus">−</button>
                  </div>
                  <p>{item.price*cartItems[item._id]}{currency}</p>
                  <p className='cart-items-remove-icon' onClick={() => deleteFromCart(item._id)}>x</p>
                </div>
                <hr />
              </div>
            )
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Thanh toán</h2>
          <div>
            <div className="cart-total-details"><p>Tổng giá trị</p><p>{getTotalCartAmount()}{currency}</p></div>
            <hr />
            <div className="cart-total-details"><p>Phí vận chuyển</p><p>{getTotalCartAmount()===0?0:deliveryCharge}{currency}</p></div>
            <hr />
            <div className="cart-total-details"><b>Tổng đơn hàng</b><b>{getTotalCartAmount()===0?0:getTotalCartAmount()+deliveryCharge}{currency}</b></div>
          </div>
          <button onClick={() => navigate('/order')}>TIẾN HÀNH THANH TOÁN</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>Nếu bạn có mã khuyến mại, hãy nhập vào đây</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='khuyến mãi'/>
              <button>Nhập</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart