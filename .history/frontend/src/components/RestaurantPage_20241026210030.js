import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './RestaurantPage.css';
import NavBarHome from './NavBarHome';

const RestaurantPage = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const { restaurantName } = useParams();

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get(`http://localhost:8000/api/restaurants/${restaurantName}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setRestaurant(response.data.restaurant);
                setIsFavorite(response.data.is_favorite); // Assume backend includes favorite status
            } catch (error) {
                console.error('Error fetching restaurant data:', error);
            }
        };

        fetchRestaurantData();
    }, [restaurantName]);

    const toggleFavorite = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('Please log in to manage favorites.');
                return;
            }

            if (isFavorite) {
                // Remove from favorites by restaurant name
                await axios.delete(`http://localhost:8000/api/customers/favorites/remove/`, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                    data: { restaurant_name: restaurant.restaurant_name }
                });
                setIsFavorite(false);
            } else {
                // Add to favorites by restaurant name
                await axios.post(`http://localhost:8000/api/customers/favorites/add/`, 
                    { restaurant_name: restaurant.restaurant_name }, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error updating favorites:', error);
        }
    };

    if (!restaurant) return <div>Loading...</div>;

    return (
        <div className="restaurant-page">
            <NavBarHome />
            <div className="restaurant-header">
                <h1>{restaurant.restaurant_name}</h1>
                <button 
                    className={`favorite-button ${isFavorite ? 'favorite' : ''}`} 
                    onClick={toggleFavorite}
                >
                    {isFavorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
                </button>
            </div>
        </div>
    );
};

export default RestaurantPage;
