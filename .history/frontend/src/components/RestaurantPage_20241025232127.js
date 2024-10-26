import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // Import useParams to access route parameters
import axios from 'axios';
import './RestaurantPage.css';  // Your CSS for styling the page
import NavBarHome from './NavBarHome';  // Import the NavBar component

const RestaurantPage = () => {
    // States for restaurant data, dishes, loading state, and error handling
    const [restaurant, setRestaurant] = useState(null); // Holds restaurant details
    const [dishes, setDishes] = useState([]); // Holds the list of dishes for the restaurant
    const [loading, setLoading] = useState(true); // Loading state to show a loading message when fetching data
    const [error, setError] = useState(null); // Error state for handling errors during data fetching

    // Extract restaurantName from the URL using useParams()
    const { restaurantName } = useParams();  // This extracts the restaurantName from the dynamic route

    // useEffect hook to fetch data when the component mounts or when restaurantName changes
    useEffect(() => {
        // Function to fetch restaurant and dishes data
        const fetchRestaurantData = async () => {
            try {
                setLoading(true);  // Set loading to true when data fetching starts
                setError(null);  // Reset error state before new request

                // Retrieve the token from local storage
                const token = localStorage.getItem('access_token');

                // Fetch the restaurant data based on the restaurantName from the URL
                const response = await axios.get(`http://localhost:8000/api/restaurants/${restaurantName.toLowerCase()}/`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Add token to Authorization header
                    }
                });

                setRestaurant(response.data.restaurant);  // Set restaurant data in state
                setDishes(response.data.dishes);  // Set dishes data in state
                setLoading(false);  // Set loading to false when data is successfully fetched
            } catch (error) {
                setError('Error fetching restaurant data');  // Set error state if fetching fails
                setLoading(false);  // Stop loading if there's an error
            }
        };

        fetchRestaurantData(); // Call the function to fetch data
    }, [restaurantName]); // This effect depends on restaurantName, so it will re-run if it changes

    // If the data is still loading, display a loading message
    if (loading) {
        return <div>Loading...</div>;
    }

    // If there is an error, display the error message
    if (error) {
        return <div>{error}</div>;
    }

    // If no restaurant data is found, display a fallback message
    if (!restaurant) {
        return <div>No restaurant data found</div>;
    }

    // Render the restaurant details and dishes if data is available
    return (
        <div className="restaurant-page">
            {/* Restaurant Header with logo and details */}
            <NavBarHome />
            <div className="restaurant-header">
                <img 
                    src={`http://localhost:8000/media/${restaurant.profile_picture}`} 
                    alt={restaurant.restaurant_name} 
                    className="restaurant-logo" 
                />
                <div className="restaurant-details">
                    <h1>{restaurant.restaurant_name}</h1>
                    <p>{restaurant.description}</p>
                    <p><strong>Location: </strong>{restaurant.location}</p>
                    <p><strong>Contact Info: </strong>{restaurant.contact_info}</p>
                    <p><strong>Timings: </strong>{restaurant.timings}</p>
                </div>
            </div>

            {/* Dishes Section */}
            ><h2>Featured Items</h2>
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
                        {/* <p><strong>${dish.price.toFixed(2)}</strong></p> Format price to 2 decimal places */}
                        <p><strong>${isNaN(Number(dish.price)) ? 'N/A' : Number(dish.price).toFixed(2)}</strong></p>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default RestaurantPage;
