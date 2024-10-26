import React, { useState, useEffect } from 'react';
import './RestaurantDashboard.css';
import NavBarBusiness from './NavBarBusiness.js';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RestaurantDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [banner, setBanner] = useState('/path-to-your-banner-image.png'); // Replace with your banner image path
  const [logo, setLogo] = useState(localStorage.getItem('restaurantProfilePicture') || '/path-to-your-logo.png'); // Replace with your default logo image path
  // Replace with your default logo image path
  const [authToken, setAuthToken] = useState(localStorage.getItem('access_token'));
  const mediaBaseURL = 'http://localhost:8000/media/';

  useEffect(() => {
    // Simulate a login check
    const checkLoginStatus = () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        setAuthToken(token);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    // Fetch restaurant details to get the logo dynamically
    if (authToken) {
      fetchRestaurantDetails();
    }
  }, [authToken]);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/restaurants/me/', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const restaurantData = response.data;

      if (restaurantData.profile_picture) {
        const updatedLogo = `${mediaBaseURL}${restaurantData.profile_picture}`;
        setLogo(updatedLogo);
        localStorage.setItem('restaurantProfilePicture', updatedLogo);
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
    }
  };

  return (
    <div className="home-container">
     < && <NavBarBusiness />
      {/* Show NavBar only if the user is not logged in */}
      {!isLoggedIn }

      {/* Banner and Logo Section */}
      <div className="banner-container">
        {/* <img src={banner} alt="Restaurant Banner" className="restaurant-banner" /> */}
        <div className="logo-container">
          <img src={logo} alt="Restaurant Logo" className="restaurant-logo" />
        </div>
      </div>

      {/* Restaurant Profile  */}
      <div className="promotions">
        <div className="promotion-card">
          <h3>Profile Information</h3>
          <Link to="/restaurantprofile">
            <button className="promotion-button">View Profile</button>
          </Link>
        </div>
        <div className="promotion-card">
          <h3>Menu</h3>
          <Link to="/restaurantmenu">
            <button className="promotion-button">View Menu</button>
          </Link>
        </div>
        <div className="promotion-card">
          <h3>Orders</h3>
          <Link to="/orders">
            <button className="promotion-button">View Orders</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
