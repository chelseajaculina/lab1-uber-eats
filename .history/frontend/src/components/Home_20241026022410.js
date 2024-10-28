import React, { useState, useEffect } from 'react';
import './Home.css';
import NavBarHome from './NavBarHome';

const Home = () => {
  const [isLoggedIn] = useState(false);
  const [restaurants, setRestaurants] = useState([]);

  // Fetch restaurant data from API
  useEffect(() => {
    fetch('/api/restaurants/list')  // Adjust the endpoint URL as needed
      .then(response => response.json())
      .then(data => setRestaurants(data))
      .catch(error => console.error('Error fetching restaurant data:', error));
  }, []);

  return (
    <div className="home-container">
      {!isLoggedIn && <NavBarHome />}

      {/* Categories Section */}
      <div className="categories-scroll">
        {["Grocery", "Breakfast", "Fast Food", "Burgers", "Pizza", "Mexican", "Wings", "Dessert", "Sushi", "BubbleTea"].map(category => (
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

      <div className="restaurant-page">
            {/* Restaurant Header with logo and details */}
            <NavBarHome />
            <div className="restaurant-header">
                <img 
                    src={`http://localhost:8000/media/${restaurant.profile_picture}`} 
                    alt={restaurant.restaurant_name} 
                    className="restaurant-logo" 
                />
                <div className="restaurant-details">
                    <h1>{restaurant.restaurant_name}</h1>
                    <p>{restaurant.description}</p>
                    <p><strong>Location: </strong>{restaurant.location}</p>
                    <p><strong>Contact Info: </strong>{restaurant.contact_info}</p>
                    <p><strong>Timings: </strong>{restaurant.timings}</p>
                </div>
            </div>

      {/* National Brands Section */}
      <div className="brands-section">
        <h2>Restaurants</h2>
        <div className="brands">
          {restaurants.map((restaurant) => (
            <div key={restaurant.name} className="brand-card">
              <img
                src={restaurant.imageUrl || `${process.env.PUBLIC_URL}/images/default-image.jpeg`}  // Use a default image if none provided
                alt={restaurant.name}
              />
              <h3>
                <a href={`/brands/${restaurant.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                  {restaurant.name}
                </a>
              </h3>
              <p>{restaurant.deliveryFee}</p>
              <p>{restaurant.estimatedTime}</p>
              <p>Rating: {restaurant.rating}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
