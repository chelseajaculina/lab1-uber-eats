import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './RestaurantPage.css';
import NavBarHome from './NavBarHome';
import CartModal from './CartModal';

const RestaurantPage = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [dishes, setDishes] = useState([]);
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const { restaurantName } = useParams();

    // Fetch restaurant data when component mounts
    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem('access_token');
                const response = await axios.get(`http://localhost:8000/api/restaurants/${restaurantName.toLowerCase()}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setRestaurant(response.data.restaurant);
                setDishes(response.data.dishes);
                setLoading(false);
            } catch (error) {
                setError('Error fetching restaurant data');
                setLoading(false);
            }
        };

        fetchRestaurantData();
    }, [restaurantName]);

    // Add item to cart or update quantity if it already exists
    const addToCart = (dish) => {
        setCart((prevCart) => {
            // Check if the item already exists in the cart
            const existingItem = prevCart.find((item) => item.id === dish.id);
            if (existingItem) {
                // If the item exists, update its quantity
                return prevCart.map((item) =>
                    item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                // If the item doesn't exist, add it to the cart with a quantity of 1
                return [...prevCart, { ...dish, quantity: 1 }];
            }
        });
    };

    // Save updated cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Handle loading and error states
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

            <div className="navbar-cart">
    <button className="view-cart-button" onClick={() => setIsCartOpen(true)}>
        View Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
    </button>
        </div>
    );
};

export default RestaurantPage;
