import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Import Link for routing
import './Home.css';
import NavBarHome from './NavBarHome';

const Home = () => {
    const [isLoggedIn] = useState(false);
    const [restaurants, setRestaurants] = useState([]);

    // Fetch restaurant data from API
    useEffect(() => {
        fetch('http://localhost:8000/api/restaurants/list/')  // Ensure the correct endpoint
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

            {/* National Brands Section */}
            <div className="brands-section">
                <h2>Restaurants</h2>
                <div className="brands">
                    {restaurants.map((restaurant) => (
                        <div key={restaurant.restaurant_name} className="brand-card">
                            <img
                                src={restaurant.profile_picture || `${process.env.PUBLIC_URL}/images/default-image.jpeg`}  // Default image if none provided
                                alt={restaurant.restaurant_name}
                                className="restaurant-logo"
                            />
                            <h3>
                                <Link to={`/restaurants/${restaurant.restaurant_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                                    {restaurant.restaurant_name}
                                </Link>
                            </h3>
                            <p><strong>Location:</strong> {restaurant.location}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
