import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Import Link to navigate to different routes
import axios from 'axios';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://localhost:8000/api/restaurants/', {
                    headers: {
                        Authorization: `Bearer ${token}` // Optional: use if your API requires authentication
                    }
                });
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
        <div className="restaurant-list">
            <h2>Available Restaurants</h2>
            <ul>
                {restaurants.map(restaurant => (
                    <li key={restaurant.id}>
                        {/* Link to individual restaurant pages */}
                        <Link to={`/brands/${restaurant.restaurant_name.toLowerCase()}`}>
                            {restaurant.restaurant_name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RestaurantList;
