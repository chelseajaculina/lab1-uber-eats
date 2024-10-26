import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import NavBarHome from './NavBarHome';

const Home = () => {
  const [isLoggedIn] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch restaurants from the backend
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/restaurants/');
        setRestaurants(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching restaurants');
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="home-container">
      {!isLoggedIn && <NavBarHome />}

      {/* Categories Section */}
      <div className="categories-scroll">
        {["Grocery", "Breakfast","Fast Food", "Burgers", "Pizza", "Mexican", "Wings", "Dessert", "Sushi", "BubbleTea"].map((category) => (
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
                src={`http://127.0.0.1:8000${restaurant.profile_picture}`} 
                alt={restaurant.name} 
                className="restaurant-image"
              />
              <h3>
                <a href={`/brands/${restaurant.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                  {restaurant.name}
                </a>
              </h3>
              <p>{restaurant.delivery_fee ? `${restaurant.delivery_fee} Delivery Fee` : 'Delivery Fee Not Available'}</p>
              <p>{restaurant.delivery_time ? `${restaurant.delivery_time} min` : 'Time Not Available'}</p>
              <p>Rating: {restaurant.rating || 'Not Rated'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
