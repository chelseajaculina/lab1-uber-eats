import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Favorites = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);

        if (token) {
            fetchFavorites(token);
        } else {
            alert('Please log in to view your favorite restaurants.');
            navigate('/login');
        }
    }, []);

    const fetchFavorites = async (token) => {
        try {
            const response = await axios.get('http://localhost:8000/api/customers/favorites/all/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(response.data.favorites);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const addFavorite = async (restaurantId) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Please log in to add favorites.');
            navigate('/login');
            return;
        }

        try {
            await axios.post(
                'http://localhost:8000/api/customers/favorites/add/',
                { restaurant_id: restaurantId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchFavorites(token); // Refresh favorites
        } catch (error) {
            console.error('Error adding favorite:', error);
        }
    };

    const removeFavorite = async (restaurantId) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Please log in to remove favorites.');
            navigate('/login');
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/api/customers/favorites/remove/${restaurantId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(favorites.filter(fav => fav.id !== restaurantId));
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
                                onClick={() => removeFavorite(restaurant.id)}
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

export default Favorites;
