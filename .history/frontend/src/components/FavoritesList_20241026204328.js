import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Favorites.css';

const FavoritesList = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // Fetch favorite restaurants (replace with your API endpoint)
        const fetchFavorites = async () => {
            const token = localStorage.getItem('access_token'); // Authorization token
            if (token) {
                const response = await axios.get('http://127.0.0.1:8000/api/customers/favorites/all/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFavorites(response.data.favorites); // Assuming response includes 'favorites' array
            }
        };
        fetchFavorites();
    }, []);

    return (
        <div className="favorites-page">
            <h2>Recently Added</h2>
            <div className="favorites-grid">
                {favorites.map((restaurant) => (
                    <div key={restaurant.id} className="favorite-card">
                        <div className="favorite-image">
                            <img src={restaurant.image} alt={restaurant.name} />
                            <div className="favorite-promotion">Free Item (Spend $25)</div>
                        </div>
                        <div className="favorite-details">
                            <h3>{restaurant.name}</h3>
                            <p className="favorite-rating">{restaurant.rating}</p>
                            <p className="favorite-info">{restaurant.delivery_fee} • {restaurant.delivery_time} min</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoritesList;
