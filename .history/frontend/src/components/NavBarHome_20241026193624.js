import React, { useState, useEffect } from 'react';
import './NavBar.css';
import axios from 'axios';
import {
    FaBars, FaMapMarkerAlt, FaShoppingCart, FaSearch,
    FaRegBookmark, FaWallet, FaUtensils, FaLifeRing, FaCar, FaGift, FaRegGrinHearts
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Logout from '../components/Logout';

const NavBarHome = () => {
    const navigate = useNavigate();
    const mediaBaseURL = 'http://127.0.0.1:8000/media/';
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [name, setName] = useState('');
    const [profilePicture, setProfilePicture] = useState(localStorage.getItem("profilePicture") || "");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('San Jose State University');
    const [activeButton, setActiveButton] = useState('delivery');


    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
    };

    // Toggle the side menu
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
                }
            };
            fetchUserData();
        }
    }, []);

    return (
        <>
            {/* Navbar */}
            <nav className="navbar">
            <div className="navbar-left">
                    <button className="menu-button" onClick={toggleMenu}>
                        <FaBars color='#000'/>
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

                <div className="navbar-right">
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
                    {/* <button className="login-button" onClick={handleLoginClick}>Log in</button>
                    <button className="signup-button">Sign up</button> */}
                    {isLoggedIn && <FaShoppingCart className="shopping-cart-icon" />}
                    <Link to="/cart">View Cart</Link>
                    
                    
                </div>
            </nav>

            {/* Side Menu */}
            {isMenuOpen && (
                <div className="side-menu">
                    <button className="close-button" onClick={toggleMenu}>✖</button>
                    {isLoggedIn ? (
                        <>
                            {/* Menu for logged-in users */}
                            <div className="user-info">
                                <img src={profilePicture} alt="User Profile" className="user-profile-pic" />
                                <h3>Welcome {name}</h3>
                                <Link to="/customerprofile" className="manage-account-link" onClick={toggleMenu}>Manage account</Link>
                            </div>
                            <div className="side-links">
                                <Link to="/orders" onClick={toggleMenu}><FaRegBookmark /> Orders</Link>
                                <Link to="/favorites" onClick={toggleMenu}><FaRegGrinHearts /> Favorites</Link>
                                <Link to="" onClick={toggleMenu}><FaWallet /> Wallet</Link>
                                <Link to="" onClick={toggleMenu}><FaUtensils /> Meal plan</Link>
                                <Link to="" onClick={toggleMenu}><FaLifeRing /> Help</Link>
                                <Link to="" onClick={toggleMenu}><FaCar /> Get a ride</Link>
                                <Link to="" onClick={toggleMenu}><FaGift /> Promotions</Link>
                                <Link to="" onClick={toggleMenu}>Uber One <span className="promo-text">Try free for 4 weeks</span></Link>
                                <Link to="" onClick={toggleMenu}><FaGift /> Invite friends <span className="invite-reward">You get $15 off</span></Link>
                            </div>
                            <Logout />
                        </>
                    ) : (
                        <>
                            {/* Menu for guests (not logged in) */}
                            <button className="signup-side-button" onClick={() => navigate('/signup')}>Sign up</button>
                            <button className="login-side-button" onClick={() => navigate('/login')}>Log in</button>
                            <div className="side-links">
                                <Link to="/business-account" onClick={toggleMenu}>Create a business account</Link>
                                <Link to="/add-restaurant" onClick={toggleMenu}>Add your restaurant</Link>
                                <Link to="/signup-to-deliver" onClick={toggleMenu}>Sign up to deliver</Link>
                            </div>
                        </>
                    )}

                    {/* Download app section - always shown */}
                    <div className="download-app">
                        <img src="/images/uber-eats-logo.png" alt="Uber Eats" />
                        <p>There's more to love in the app.</p>
                        <div className="app-links">
                            <button>iPhone</button>
                            <button>Android</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NavBarHome;
