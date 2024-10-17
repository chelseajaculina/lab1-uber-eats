import React from 'react';
import './Home.css';
import NavBarHome from './NavBarHome';

// import Login from './Login';
//import {useNavigate } from 'react-router-dom';

import { useState } from 'react';

const Home = () => {
  const [isLoggedIn] = useState(false);

  return (
    <div className="home-container">
      {/* Show NavBar only if the user is not logged in */}
      {!isLoggedIn && (<NavBarHome />)}

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

      {/* Categories Section */}
      <div className="categories">
        {["Grocery", "Fast Food", "Pizza", "Mexican", "Ice Cream", "Wings", "Chinese", "Desserts", "Indian", "Burgers", "Asian"].map((category) => (
          <div key={category} className="category-item">
            <img src={process.env.PUBLIC_URL + `/images/${category.toLowerCase()}.png`} alt={category} />
            <span>{category}</span>
          </div>
        ))}
      </div>

      {/* National Brands Section */}
      <div className="brands-section">
        <h2>National brands</h2>
        <div className="brands">
          {[
            { name: "McDonald's", deliveryFee: "Higher Delivery Fee", time: "20-35 min", rating: 4.5 },
            { name: "Jack in the Box", deliveryFee: "Low Delivery Fee", time: "10-20 min", rating: 4.5 },
            { name: "Taco Bell", deliveryFee: "Moderate Delivery Fee", time: "15-30 min", rating: 4.5 },
            { name: "Carl's Jr.", deliveryFee: "Moderate Delivery Fee", time: "10-25 min", rating: 4.6 }
          ].map((brand) => (
            <div key={brand.name} className="brand-card">
              <img src={process.env.PUBLIC_URL + `/images/${brand.name.toLowerCase().replace(' ', '')}.jpg`} alt={brand.name} />
              <h3>{brand.name}</h3>
              <p>{brand.deliveryFee} • {brand.time}</p>
              <p>Rating: {brand.rating}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
