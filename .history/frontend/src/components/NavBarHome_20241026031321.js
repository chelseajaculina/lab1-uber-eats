import React, { useState, useEffect } from 'react';
import './NavBar.css';
import axios from 'axios';
import {
    FaBars, FaMapMarkerAlt, FaSearch,
    FaRegBookmark, FaWallet, FaUtensils, FaLifeRing, FaCar, FaGift, FaRegGrinHearts
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Logout from '../components/Logout';
import CartIcon from './CartIcon';  // Import CartIcon component

const NavBarHome = () => {
    const navigate = useNavigate();
    const mediaBaseURL = 'http://127.0.0.1:8000/media/';
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [name, setName] = useState('');
    const [profilePicture, setProfilePicture] = useState(localStorage.getItem("profilePicture") || "");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('San Jose State University');
    const [activeButton, setActiveButton] = useState('delivery');
    const [cartItemCount, setCartItemCount] = useState(0);  // State for cart item count

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

        // Example of setting cart item count; replace with actual logic to get cart items
        const storedCartItemCount = localStorage.getItem('cartItemCount') || 0;
        setCartItemCount(parseInt(storedCartItemCount));
    }, []);

    return (
        <>
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

                    {/* Cart Icon with Item Count */}
                    <Link to="/cart">
                        <CartIcon itemCount={cartItemCount} />
                    </Link>
                </div>
            </nav>
        </>
    );
};

export default NavBarHome;
