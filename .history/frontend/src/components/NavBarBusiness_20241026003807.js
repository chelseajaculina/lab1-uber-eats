import React, { useState, useEffect } from 'react';
import './NavBarBusiness.css';
import axios from 'axios';
import {
    FaBars, FaClipboardList, FaLifeRing, FaChartLine, FaConciergeBell, FaGift, FaUsers
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Logout from '../components/Logout';

const NavBarBusiness = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profilePicture, setProfilePic] = useState(localStorage.getItem('restaurantProfilePicture') || '');
    const [restaurantName, setRestaurantName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const mediaBaseURL = 'http://127.0.0.1:8000';

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsLoggedIn(true);
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`${mediaBaseURL}/api/restaurants/me/`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.data.restaurant_name) {
                        setRestaurantName(response.data.restaurant_name);
                    }
                    if (response.data.profile_picture) {
                        const profilePictureUrl = `${mediaBaseURL}${response.data.profile_picture}`;
                        setProfilePic(profilePictureUrl);
                        localStorage.setItem('restaurantProfilePicture', profilePictureUrl);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error.response ? error.response.data : error.message);
                }
            };
            fetchUserData();
        }
    }, [mediaBaseURL]);

    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <button className="menu-button" onClick={toggleMenu}>
                        <FaBars color="black" />
                    </button>
                    <h2 className="brand-title">
                        <Link to="/restaurantdashboard" className="brand-link">Uber Eats Business</Link>
                    </h2>
                </div>
            </nav>

            {isMenuOpen && (
                <div className="side-menu">
                    <button className="close-button" onClick={toggleMenu}>✖</button>

                    {isLoggedIn ? (
                        <div className="user-info">
                            <img src={profilePicture || '/default-profile.png'} alt="User Profile" className="user-profile-pic" />
                            <h3>Welcome, {restaurantName || "Restaurant Owner"}</h3>
                            <Link to="/restaurantprofile" className="manage-account-link">Manage account</Link>
                            <div className="side-links">
                                <Link to="/manage-orders" onClick={toggleMenu}><FaClipboardList /> Manage Orders</Link>
                                <Link to="/manage-dishes" onClick={toggleMenu}><FaConciergeBell /> Manage Dishes</Link>
                                <Link to="/restaurant-analytics" onClick={toggleMenu}><FaChartLine /> Analytics</Link>
                                <Link to="/promotions" onClick={toggleMenu}><FaGift /> Promotions</Link>
                                <Link to="/help" onClick={toggleMenu}><FaLifeRing /> Help</Link>
                                <Link to="/staff" onClick={toggleMenu}><FaUsers /> Manage Staff</Link>
                            </div>
                            <Logout />
                        </div>
                    ) : (
                        <>
                            <button className="signup-side-button" onClick={() => navigate('/signup')}>Sign up</button>
                            <button className="login-side-button" onClick={() => navigate('/login')}>Log in</button>
                            <div className="side-links">
                                <Link to="/business-account" onClick={toggleMenu}>Create a business account</Link>
                                <Link to="/add-restaurant" onClick={toggleMenu}>Add your restaurant</Link>
                                <Link to="/signup-to-deliver" onClick={toggleMenu}>Sign up to deliver</Link>
                            </div>
                        </>
                    )}

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

export default NavBarBusiness;
