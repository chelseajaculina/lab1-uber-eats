import React, { useState, useEffect } from 'react';
import './RestaurantPage.css';
import axios from 'axios';

const Panda = () => {
    const [restaurant, setRestaurant] = useState({});
    const [menuCategories, setMenuCategories] = useState([]);
    const [featuredItems, setFeaturedItems] = useState([]);

    useEffect(() => {
        // Fetch restaurant details from API
        axios.get('http://localhost:8000/api/restaurants/pandaexpress/') // Replace with the correct endpoint
            .then(response => {
                setRestaurant(response.data);
                setMenuCategories(response.data.menu_categories); // Example: if restaurant data has categories
                setFeaturedItems(response.data.featured_items); // Example: featured items
            })
            .catch(error => console.error('Error fetching restaurant details:', error));
    }, []);

    return (
        <div className="restaurant-page">
            {/* Restaurant Header */}
            <div className="restaurant-header">
                <img className="restaurant-image" src={restaurant.image_url} alt={restaurant.name} />
                <div className="restaurant-info">
                    <h1>{restaurant.name}</h1>
                    <div className="rating">
                        <span>⭐ {restaurant.rating}</span>
                        <span>({restaurant.num_reviews}+)</span>
                    </div>
                    <div className="restaurant-options">
                        <button className="option-button">Delivery</button>
                        <button className="option-button">Pickup</button>
                        <button className="option-button">Group Order</button>
                    </div>
                </div>
            </div>

            {/* Menu Sidebar and Featured Items */}
            <div className="restaurant-content">
                <aside className="menu-sidebar">
                    <h3>Menu</h3>
                    <ul>
                        {menuCategories.map((category, index) => (
                            <li key={index}>{category.name}</li>
                        ))}
                    </ul>
                </aside>

                <main className="featured-items">
                    <h3>Featured Items</h3>
                    <div className="items-grid">
                        {featuredItems.map((item) => (
                            <div key={item.id} className="item-card">
                                <img src={item.image_url} alt={item.name} />
                                <div className="item-info">
                                    <h4>{item.name}</h4>
                                    <p>${item.price.toFixed(2)}</p>
                                    <button className="add-to-cart-button">+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default RestaurantPage;