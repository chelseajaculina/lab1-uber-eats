import React, { useState, useEffect } from 'react';
import './Home.css';
import NavBarHome from './NavBarHome';
import axios from 'axios';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  
  const [restaurants, setRestaurants] = useState([]);

  // Check for token to determine login status
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  // Fetch restaurant data from Django API
  useEffect(() => {
    axios.get('http://localhost:8000/api/restaurants/restaurants/list/')
      .then(response => {
        setRestaurants(response.data); // Adjust if data structure is different
      })
      .catch(error => {
        console.error("Error fetching restaurants:", error);
      });
  }, []);

  return (
    <div className="home-container">
      {/* Show NavBar only if the user is not logged in */}
      {!isLoggedIn && <NavBarHome />}

      {/* Promotions Section */}
      <div className="promotions">
        <div className="promotion-card">
          <h3>$15 off when you invite your friends</h3>
          <button className="promotion-button">Invite & earn</button>
        </div>
        <div className="promotion-card">
          <h3>$0 Delivery Fee + up to 10% off with Uber One</h3>
          <button className="promotion-button">Try free for 4 weeks</button>
        </div>
        <div className="promotion-card">
          <h3>Check out gameday deals</h3>
          <button className="promotion-button">Shop deals</button>
        </div>
      </div>

      {/* Restaurants Section */}
      <div className="brands-section">
        <h2>National brands</h2>
        <div className="brands">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="brand-card">
              <img 
                src={restaurant.profile_picture || `${process.env.PUBLIC_URL}/images/default-restaurant.jpg`} 
                alt={restaurant.restaurant_name} 
                className="restaurant-image"
              />
              <h3>{restaurant.restaurant_name}</h3>
              <p>{restaurant.delivery_fee} Delivery Fee • {restaurant.delivery_time} min</p>
              <p className="rating">Rating: {restaurant.rating}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
