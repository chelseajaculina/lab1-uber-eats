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
        console.log("API Response:", response.data);  // Add this line
        setRestaurants(response.data.res); // Assume response data is an array of restaurants with dishes
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
      <div className="brands-section">
        <h2>Restaurants</h2>
        <div className="brands">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="brand-card">
              <img 
                src={restaurant.profile_picture || `${process.env.PUBLIC_URL}/images/default-restaurant.jpg`} 
                alt={restaurant.restaurant_name} 
                className="restaurant-image"
              />
              <h3>
                <a href={`/brands/${restaurant.restaurant_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                  {restaurant.restaurant_name}
                </a>
              </h3>
              <p>{restaurant.location}</p>
              <p>{restaurant.description}</p>
              <h4>Dishes:</h4>
              <ul>
                {restaurant.dishes && restaurant.dishes.map(dish => (
                  <li key={dish.id}>
                    {dish.name} - ${dish.price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
