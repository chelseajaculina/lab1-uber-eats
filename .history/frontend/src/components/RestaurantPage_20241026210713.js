import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './RestaurantPage.css';
import NavBarHome from './NavBarHome';

const RestaurantPage = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [dishes, setDishes] = useState([]);
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const { restaurantName } = useParams();

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem('access_token');

                const response = await axios.get(`http://localhost:8000/api/restaurants/${restaurantName}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setRestaurant(response.data.restaurant);
                setDishes(response.data.dishes);
                setIsFavorite(response.data.is_favorite); // Assuming backend includes favorite status
                setLoading(false);
            } catch (error) {
                setError('Error fetching restaurant data');
                setLoading(false);
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
                await axios.delete(`http://localhost:8000/api/customers/list/`, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                    data: { restaurant_name: restaurant.restaurant_name } // Send restaurant name in the request body
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
    

    const addToCart = (dish) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === dish.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...dish, quantity: 1 }];
            }
        });
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!restaurant) return <div>No restaurant data found</div>;

    return (
        <div className="restaurant-page">
            <NavBarHome />
            <div className="restaurant-header">
                <img src={`http://localhost:8000/media/${restaurant.profile_picture}`} alt={restaurant.restaurant_name} className="restaurant-logo" />
                <div className="restaurant-details">
                    <h1>{restaurant.restaurant_name}</h1>
                    <p>{restaurant.description}</p>
                    <p><strong>Location: </strong>{restaurant.location}</p>
                    <p><strong>Contact Info: </strong>{restaurant.contact_info}</p>
                    <p><strong>Timings: </strong>{restaurant.timings}</p>
                    <button 
                        className={`favorite-button ${isFavorite ? 'favorite' : ''}`} 
                        onClick={toggleFavorite}
                    >
                        {isFavorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
                    </button>
                </div>
            </div>

            <h3>Featured Items</h3>
            <div className="dish-list">
                {dishes.map(dish => (
                    <div className="dish-card" key={dish.id}>
                        <img src={`http://localhost:8000/${dish.image}`} alt={dish.name} className="dish-image" />
                        <h3>{dish.name}</h3>
                        <p>{dish.description}</p>
                        <p><strong>${Number(dish.price).toFixed(2)}</strong></p>
                        <button className="add-to-cart-button" onClick={() => addToCart(dish)}>+</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RestaurantPage;
