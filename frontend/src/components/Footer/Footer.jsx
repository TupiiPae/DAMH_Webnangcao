import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <p>Peteco là công ty hàng đầu trong ngành thú cưng, chuyên cung cấp các sản phẩm và dịch vụ chất lượng cho thú cưng của bạn. Chúng tôi cam kết mang đến những loài thú cưng khỏe mạnh, đáng yêu và được chăm sóc chu đáo, cùng với các phụ kiện, thức ăn và đồ chơi cao cấp. Với sứ mệnh giúp mỗi gia đình có những người bạn bốn chân trung thành và vui vẻ, Peteco luôn đồng hành cùng bạn trong hành trình chăm sóc và nuôi dưỡng thú cưng.</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>PETECO</h2>
            <ul>
                <li>Trang chủ</li>
                <li>Giới thiệu</li>
                <li>Các dịch vụ khác</li>
                <li>Liên hệ</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>Thông tin liên hệ</h2>
            <ul>
                <li>Phạm Tuấn Phi - 2274802010650</li>
                <li>phi.2274802010650@vanlanguni.vn</li>
                <br></br>
                <li>Thái Lê Nhật Thiên - 2274802010831</li>
                <li>thien.2274802010831@vanlanguni.vn</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">ĐỒ ÁN MÔN HỌC - LẬP TRÌNH WEB NÂNG CAO</p>
    </div>
  )
}

export default Footer
