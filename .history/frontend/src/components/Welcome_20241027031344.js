import './Welcome.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const Welcome = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleLoginDropdown = () => {
        setIsLoginDropdownOpen(!isLoginDropdownOpen);
    };

    const handleCustomerLogin = () => {
        navigate('/customer-login');
        setIsLoginDropdownOpen(false); // Close dropdown after selection
    };

    const handleRestaurantLogin = () => {
        navigate('/restaurant-login');
        setIsLoginDropdownOpen(false); // Close dropdown after selection
    };

    return (
        <div className="landing-container">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="navbar-left">
                    <button className="menu-button" onClick={toggleMenu}>☰</button>
                    <h3><Link to="/home" className="brand-title">Uber Eats</Link></h3>
                </div>
                {!isLoggedIn && (
                    <div className="navbar-right">
                        {/* Login Dropdown */}
                        <div className="login-dropdown">
                            <button className="login-button" onClick={toggleLoginDropdown}>
                                Log in
                            </button>
                            {isLoginDropdownOpen && (
                                <div className="login-dropdown-menu">
                                    <button onClick={handleCustomerLogin}>Customer Login</button>
                                    <button onClick={handleRestaurantLogin}>Restaurant Login</button>
                                </div>
                            )}
                        </div>
                        <button className="signup-button" onClick={() => navigate('/signup')}>Sign up</button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <h1>Order delivery near you</h1>

                <div className="address-input-section">
                    <div className="input-box">
                        <FaMapMarkerAlt className="icon" />
                        <input type="text" placeholder="Enter delivery address" />
                    </div>
                    <div className="delivery-time-dropdown">
                        <AiOutlineClockCircle className="icon" />
                        <select>
                            <option>Deliver now</option>
                            <option>Schedule for later</option>
                        </select>
                    </div>
                    <button className="search-button">Search here</button>
                    <Link to 
                </div>
            </header>

            {isMenuOpen && (
                <div className="side-menu">
                    <button className="close-button" onClick={toggleMenu}>✖</button>
                    {!isLoggedIn ? (
                        <>
                            <button className="signup-side-button" onClick={() => navigate('/signup')}>Sign up</button>
                            <button className="login-side-button" onClick={toggleLoginDropdown}>Log in</button>
                            <div className="side-links">
                                <Link to="/business-account">Create a business account</Link>
                                <Link to="/add-restaurant">Add your restaurant</Link>
                                <Link to="/signup-to-deliver">Sign up to deliver</Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3>Welcome back!</h3>
                            <div className="side-links">
                                <Link to="/orders">Your Orders</Link>
                                <Link to="/account">Account Settings</Link>
                                <Link to="/help">Help</Link>
                            </div>
                            <button className="logout-button" onClick={() => {
                                localStorage.removeItem('authToken');
                                setIsLoggedIn(false);
                                toggleMenu();
                            }}>Log out</button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Welcome;
