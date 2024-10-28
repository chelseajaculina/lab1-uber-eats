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
        console.log("API Response:", response.data);  // Check response structure
        setRestaurants(response.data);  // Assume response is an array of restaurants with dishes
      })
      .catch(error => {
        console.error("Error fetching restaurants:", error);
      });
  }, []);

  return (
    <div className="home-container">
      <NavBarHome />

      <div className="brands-section">
        <h2>Restaurants</h2>
        <div className="brands">
          {restaurants.map((item) => (
            <div key={item.restaurant.id} className="brand-card">
              <img 
                src={item.restaurant.profile_picture ? `http://localhost:8000/media/${item.restaurant.profile_picture}` : `${process.env.PUBLIC_URL}/images/default-restaurant.jpg`} 
                alt={item.restaurant.restaurant_name} 
                className="restaurant-image"
              />
              <h3>
                <a href={`/brands/${item.restaurant.restaurant_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                  {item.restaurant.restaurant_name}
                </a>
              </h3>
              <p>{item.restaurant.location}</p>
              <p>{item.restaurant.description}</p>
              <h4>Dishes:</h4>
              <ul>
                {item.dishes && item.dishes.map(dish => (
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
