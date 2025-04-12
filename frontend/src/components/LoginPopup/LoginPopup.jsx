import React, { useContext, useState, useEffect, useRef } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG, faFacebookF, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const LoginPopup = ({ setShowLogin }) => {
    const { setToken, url, loadCartData } = useContext(StoreContext);
    const [currState, setCurrState] = useState('Login');
    const [showPassword, setShowPassword] = useState(false);

    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const popupRef = useRef(null);

    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            setShowLogin(false);
        }
    };

    useEffect(() => {
        // Prevent scrolling when popup is open
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            // Restore original overflow state
            document.body.style.overflow = originalOverflow || 'auto';
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData((data) => ({ ...data, [name]: value }));
    };

    const onLogin = async (e) => {
        e.preventDefault();
        let new_url = url;
        if (currState === 'Login') {
            new_url += '/api/user/login';
        } else {
            new_url += '/api/user/register';
        }
        const response = await axios.post(new_url, data);
        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            loadCartData({ token: response.data.token });
            setShowLogin(false);
        } else {
            toast.error(response.data.message);
        }
    };

    return (
        <div className="login-popup">
            <div className={`container ${currState === 'Sign Up' ? 'active' : ''}`} ref={popupRef}>
                <div className="form-container sign-up">
                    <form onSubmit={onLogin}>
                        <h1>Đăng ký</h1>
                        <div className="social-icons">
                            <a href="#" className="icon">
                                <FontAwesomeIcon icon={faGooglePlusG} />
                            </a>
                            <a href="#" className="icon">
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                            <a href="#" className="icon">
                                <FontAwesomeIcon icon={faGithub} />
                            </a>
                            <a href="#" className="icon">
                                <FontAwesomeIcon icon={faLinkedinIn} />
                            </a>
                        </div>
                        <span>hoặc sử dụng email để đăng ký</span>
                        <input
                            name="name"
                            onChange={onChangeHandler}
                            value={data.name}
                            type="text"
                            placeholder="Name"
                            required
                        />
                        <input
                            name="email"
                            onChange={onChangeHandler}
                            value={data.email}
                            type="email"
                            placeholder="Email"
                            required
                        />
                        <input
                            name="password"
                            onChange={onChangeHandler}
                            value={data.password}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            required
                        />
                        <div className="show-password">
                            <input
                                type="checkbox"
                                id="show-password-signup"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            <label htmlFor="show-password-signup">Hiển thị mật khẩu</label>
                        </div>
                        <button type="submit">Đăng ký</button>
                    </form>
                </div>
                <div className="form-container sign-in">
                    <form onSubmit={onLogin}>
                        <h1>Đăng nhập</h1>
                        <div className="social-icons">
                            <a href="#" className="icon">
                                <FontAwesomeIcon icon={faGooglePlusG} />
                            </a>
                            <a href="#" className="icon">
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                            <a href="#" className="icon">
                                <FontAwesomeIcon icon={faGithub} />
                            </a>
                            <a href="#" className="icon">
                                <FontAwesomeIcon icon={faLinkedinIn} />
                            </a>
                        </div>
                        <span>hoặc sử dụng mật khẩu email</span>
                        <input
                            name="email"
                            onChange={onChangeHandler}
                            value={data.email}
                            type="email"
                            placeholder="Email"
                            required
                        />
                        <input
                            name="password"
                            onChange={onChangeHandler}
                            value={data.password}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            required
                        />
                        <div className="show-password">
                            <input
                                type="checkbox"
                                id="show-password-signin"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            <label htmlFor="show-password-signin">Hiển thị mật khẩu</label>
                        </div>
                        <a href="#" style={{ color: 'tomato' }}>Quên mật khẩu?</a>
                        <button type="submit">Đăng nhập</button>
                    </form>
                </div>
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Chào mừng trở lại!</h1>
                            <p>Nhập thông tin cá nhân của bạn để sử dụng tất cả các tính năng của trang web</p>
                            <button
                                className="hidden"
                                onClick={() => setCurrState('Login')}
                                type="button"
                            >
                                Đăng nhập
                            </button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Chào bạn!</h1>
                            <p>Đăng ký thông tin cá nhân của bạn để sử dụng tất cả các tính năng của trang web</p>
                            <button
                                className="hidden"
                                onClick={() => setCurrState('Sign Up')}
                                type="button"
                            >
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </div>
                <div className="close-btn">
                    <img
                        onClick={() => setShowLogin(false)}
                        src={assets.cross_icon}
                        alt="Close"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPopup;