import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './RestaurantPage.css';
import NavBarHome from './NavBarHome';

const RestaurantPage = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [dishes, setDishes] = useState([]);
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []); // Initialize cart from localStorage
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { restaurantName } = useParams();

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem('access_token');

                // Fetch data only for user_type 'restaurant'
                const response = await axios.get(`http://localhost:8000/api/restaurants/${restaurantName.toLowerCase()}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        user_type: 'restaurant' // assuming this is supported by the API
                    }
                });

                // Check if the restaurant data has user_type 'restaurant'
                if (response.data.restaurant && response.data.restaurant.user_type === 'restaurant') {
                    setRestaurant(response.data.restaurant);
                    setDishes(response.data.dishes);
                } else {
                    setError("No data available for this restaurant.");
                }

                setLoading(false);
            } catch (error) {
                setError('Error fetching restaurant data');
                setLoading(false);
            }
        };

        fetchRestaurantData();
    }, [restaurantName]);

    const addToCart = (dish) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === dish.id);
            if (existingItem) {
                // If the item already exists in the cart, update its quantity
                return prevCart.map((item) =>
                    item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                // If it's a new item, add it to the cart with quantity 1
                return [...prevCart, { ...dish, quantity: 1 }];
            }
        });
    };

    // Save cart to localStorage whenever it changes
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
                <img 
                    src={`http://localhost:8000/media/${restaurant.profile_picture}`} 
                    alt={restaurant.restaurant_name} 
                    className="restaurant-logo" 
                />
                <div className="restaurant-details">
                    <b><h1>{restaurant.restaurant_name}</h1></b>
                    <p>{restaurant.description}</p>
                    <p><strong>Location: </strong>{restaurant.location}</p>
                    <p><strong>Contact Info: </strong>{restaurant.contact_info}</p>
                    <p><strong>Timings: </strong>{restaurant.timings}</p>
                </div>
            </div>

            <h3>Featured Items</h3>
            <div className="dish-list">
                {dishes.map(dish => (
                    <div className="dish-card" key={dish.id}>
                        <img 
                            src={`http://localhost:8000/${dish.image}`} 
                            alt={dish.name} 
                            className="dish-image" 
                        />
                        <h3>{dish.name}</h3>
                        <p>{dish.description}</p>
                        <p><strong>${isNaN(Number(dish.price)) ? 'N/A' : Number(dish.price).toFixed(2)}</strong></p>
                        <button className="add-to-cart-button" onClick={() => addToCart(dish)}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RestaurantPage;