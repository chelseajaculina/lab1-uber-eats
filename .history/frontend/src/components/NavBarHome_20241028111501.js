import React, { useState, useEffect, useContext } from 'react';
import './NavBar.css';
import axios from 'axios';
import {
    FaBars, FaMapMarkerAlt, FaShoppingCart, FaSearch,
    FaRegBookmark, FaWallet, FaUtensils, FaLifeRing, FaCar, FaGift, FaRegGrinHearts, FaApple, FaAndroid, FaTimes
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Logout from '../components/Logout';
import CartContext from '../contexts/CartContext';
import CartModal from '../components/CartModal';
import { PiSecurityCameraThin } from 'react-icons/pi';

const NavBarHome = () => {
    const navigate = useNavigate();
    const mediaBaseURL = 'http://127.0.0.1:8000/media/';
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [name, setName] = useState('');
    const [profilePicture, setProfilePicture] = useState(localStorage.getItem("profilePicture") || "");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('San Jose State University');
    const [activeButton, setActiveButton] = useState('delivery');

    const { cart } = useContext(CartContext); // Access the cart from context
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('profilePicture');
        setIsLoggedIn(false);
        setName('');
        setProfilePicture('');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsLoggedIn(true);
            const fetchUserData = async () => {
                try {
                    const response = await axios.get('http://127.0.0.1:8000/api/customers/me/', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setName(response.data.name);
                    if (response.data.profile_picture) {
                        const profilePictureUrl = response.data.profile_picture.startsWith("http")
                            ? response.data.profile_picture
                            : `${mediaBaseURL}${response.data.profile_picture}`;
                        setProfilePicture(profilePictureUrl);
                        localStorage.setItem('profilePicture', profilePictureUrl);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error.response ? error.response.data : error.message);
                    handleLogout();
                }
            };
            fetchUserData();
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <>
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-left">
                    <button className="menu-button" onClick={toggleMenu}>
                        {isMenuOpen ? <FaTimes color='#000' /> : <FaBars color='#000' />}
                    </button>
                    <h2 className="brand-title">
                        <Link to="/home" className="brand-link">Uber Eats</Link>
                    </h2>
                    <div className="delivery-pickup-buttons">
                        <button 
                            className={`delivery-btn ${activeButton === 'delivery' ? 'active' : ''}`} 
                            onClick={() => setActiveButton('delivery')}
                        >
                            Delivery
                        </button>
                        <button 
                            className={`pickup-btn ${activeButton === 'pickup' ? 'active' : ''}`} 
                            onClick={() => setActiveButton('pickup')}
                        >
                            Pickup
                        </button>
                    </div>
                </div>

                <div className={`navbar-right ${isMenuOpen ? 'open' : ''}`}>
                    <div className="location">
                        <FaMapMarkerAlt />
                        <select
                            value={selectedLocation}
                            onChange={handleLocationChange}
                            className="location-dropdown"
                        >
                            <option value="San Jose State University">San Jose State University</option>
                            <option value="San Francisco">San Francisco</option>
                            <option value="Los Angeles">Los Angeles</option>
                            <option value="New York">New York</option>
                            <option value="Chicago">Chicago</option>
                        </select>
                    </div>
                    <div className="search-box">
                        <FaSearch />
                        <input type="text" placeholder="Search Uber Eats" />
                    </div>
                    {!isLoggedIn && (
                        <>
                            <button className="login-button" onClick={handleLoginClick}>Log in</button>
                            <button className="signup-button" onClick={handleSignUpClick}>Sign up</button>
                        </>
                    )}
                    {isLoggedIn && (
                        <div className="cart-container">
                            <button className="view-cart-button" onClick={() => setIsCartOpen(true)}>
                                <FaShoppingCart className="shopping-cart-icon" />
                                View Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Cart Modal */}
            {isCartOpen && (
                <CartModal cart={cart} setCart={() => {PiSecurityCameraThin}} onClose={() => setIsCartOpen(false)} />
            )}
        </>
    );
};

export default NavBarHome;
