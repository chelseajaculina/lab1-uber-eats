## favorites.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Favorites.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate here

const FavoritesTab = () => {
    const navigate = useNavigate(); // Define navigate using useNavigate
    const [favorites, setFavorites] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);

        if (token) {
            fetchFavorites(token);
        } else {
            alert('Please log in to view your favorite restaurants.');
            navigate('/login'); // Redirects to login page if not logged in
        }
    }, []);

    const fetchFavorites = async (token) => {
        try {
            const response = await axios.get('http://localhost:8000/api/customers/favorites/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(response.data.map(fav => ({
                id: fav.restaurant.id,
                name: fav.restaurant.name,
                description: fav.restaurant.description,
                location: fav.restaurant.location,
            })));
        } catch (error) {
            console.error('Error fetching favorite restaurants:', error);
        }
    };

    const handleRemoveFavorite = async (brandId) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Please log in to remove favorites.');
            navigate('/login');
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/api/customers/favorites/${brandId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(favorites.filter(fav => fav.id !== brandId));
        } catch (error) {
            console.error('Error removing favorite restaurant:', error);
        }
    };

    return (
        <div className="favorites-tab">
            <h2>Your Favorite Restaurants</h2>
            {favorites.length === 0 ? (
                <p>No favorite restaurants added yet.</p>
            ) : (
                <div className="favorite-restaurants">
                    {favorites.map((restaurant) => (
                        <div key={restaurant.id} className="favorite-restaurant">
                            <h3>{restaurant.name}</h3>
                            <p>{restaurant.description}</p>
                            <p><strong>Location:</strong> {restaurant.location}</p>
                            <button
                                className="remove-favorite-button"
                                onClick={() => handleRemoveFavorite(restaurant.id)}
                            >
                                Remove from Favorites
                            </button>
                            <Link to={`/brands/${restaurant.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                                <button className="view-details-button">View Details</button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesTab;