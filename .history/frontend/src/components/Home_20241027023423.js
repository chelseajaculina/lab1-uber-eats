import React, { useState, useEffect } from 'react';
import './Home.css';
import NavBarHome from './NavBarHome';
import axios from 'axios';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);

  // Fetch restaurant data from Django API
  useEffect(() => {
    axios.get('http://localhost:8000/api/restaurants/restaurants/list/')
      .then(response => {
        console.log("API Response:", response.data);  // Log the response data for debugging
        setRestaurants(response.data);  // Assume response is an array of restaurants with their details
      })
      .catch(error => {
        console.error("Error fetching restaurants:", error);
      });
  }, []);

  return (
    <div className="home-container">
      {/* Always show NavBar */}
      <NavBarHome />

      {/* Categories Section */}
      <div className="categories-scroll">
        {["Grocery", "Breakfast", "Fast Food", "Burgers", "Pizza", "Mexican", "Wings", "Dessert", "Sushi", "BubbleTea"].map((category) => (
          <div key={category} className="category-item">
            <img src={`${process.env.PUBLIC_URL}/images/${category.toLowerCase()}.png`} alt={category} />
            <span>{category}</span>
          </div>
        ))}
      </div>

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
      <div className="restaurants-section">
        <h2>Restaurants</h2>
        <div className="restaurants-list">
          {restaurants.map((item, index) => (
            <div key={index} className="restaurant-card">
              <img 
                src={item.restaurant.profile_picture ? `http://localhost:8000/media/${item.restaurant.profile_picture}` : `${process.env.PUBLIC_URL}/images/default-restaurant.jpg`} 
                alt={item.restaurant.restaurant_name} 
                className="restaurant-logo"
              />
              <div className="restaurant-details">
                <h1>{item.restaurant.restaurant_name}</h1>
                <p>{item.restaurant.description}</p>
                <p><strong>Location: </strong>{item.restaurant.location}</p>
                <p><strong>Contact Info: </strong>{item.restaurant.contact_info}</p>
                <p><strong>Timings: </strong>{item.restaurant.timings}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
