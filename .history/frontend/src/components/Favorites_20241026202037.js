import React, { useState, useEffect } from 'react';  // Import necessary hooks and modules from React
import axios from 'axios';  // Import axios for making HTTP requests
import { Link, useNavigate } from 'react-router-dom';  // Import Link and useNavigate for routing

// Define the Favorites component
const Favorites = () => {
    const navigate = useNavigate();  // Create a navigate function for navigation actions
    const [favorites, setFavorites] = useState([]);  // State to store favorite restaurants
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // State to track login status

    // useEffect hook to run code on component mount
    useEffect(() => {
        const token = localStorage.getItem('access_token');  // Retrieve token from local storage
        if (token) {
            verifyToken(token);  // Verify token before fetching favorites if it exists
        } else {
            alert('Please log in to view your favorite restaurants.');  // Alert if no token is found
            navigate('/login');  // Redirect to login page if not logged in
        }
    }, [navigate]);  // Dependency array includes navigate to avoid stale closures

    // Function to verify the validity of the token
    const verifyToken = async (token) => {
        try {
            // Make a request to verify the token
            await axios.get('http://localhost:8000/api/token/verify/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsLoggedIn(true);  // Set logged-in status to true if token is valid
            fetchFavorites(token);  // Fetch favorites if token is verified
        } catch (error) {
            console.error('Token verification failed:', error);  // Log any errors in token verification
            localStorage.removeItem('access_token');  // Remove invalid token from storage
            alert('Your session has expired. Please log in again.');  // Alert user of session expiry
            navigate('/login');  // Redirect to login page
        }
    };

    // Function to fetch favorite restaurants
    const fetchFavorites = async (token) => {
        try {
            const response = await axios.get('http://localhost:8000/api/customers/favorites/all/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(response.data.favorites);  // Update favorites state with data from response
        } catch (error) {
            console.error('Error fetching favorites:', error);  // Log any errors in fetching favorites
            if (error.response && error.response.status === 401) {
                alert('Your session has expired. Please log in again.');  // Alert on unauthorized access
                navigate('/login');  // Redirect to login if session is expired
            }
        }
    };

    // Function to add a restaurant to favorites
    const addFavorite = async (restaurantId) => {
        const token = localStorage.getItem('access_token');  // Retrieve token from local storage
        if (!token) {
            alert('Please log in to add favorites.');  // Alert if not logged in
            navigate('/login');  // Redirect to login if no token
            return;  // Exit the function if not logged in
        }

        try {
            await verifyToken(token);  // Verify token before adding favorite
            await axios.post(
                'http://localhost:8000/api/customers/favorites/add/',  // URL for adding a favorite
                { restaurant_id: restaurantId },  // Request body with restaurant ID
                { headers: { Authorization: `Bearer ${token}` } }  // Authorization header
            );
            fetchFavorites(token);  // Refresh favorites list after adding a favorite
        } catch (error) {
            console.error('Error adding favorite:', error);  // Log any errors in adding favorite
        }
    };

    // Function to remove a restaurant from favorites
    const removeFavorite = async (restaurantId) => {
        const token = localStorage.getItem('access_token');  // Retrieve token from local storage
        if (!token) {
            alert('Please log in to remove favorites.');  // Alert if not logged in
            navigate('/login');  // Redirect to login if no token
            return;  // Exit the function if not logged in
        }

        try {
            await verifyToken(token);  // Verify token before removing favorite
            await axios.delete(`http://localhost:8000/api/customers/favorites/remove/${restaurantId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(favorites.filter(fav => fav.id !== restaurantId));  // Update favorites list after removal
        } catch (error) {
            console.error('Error removing favorite restaurant:', error);  // Log any errors in removal
        }
    };

    // Render the favorites list UI
    return (
        <div className="favorites-tab">
            <h2>Your Favorite Restaurants</h2>
            {favorites.length === 0 ? (  // Check if favorites list is empty
                <p>No favorite restaurants added yet.</p>  // Show message if no favorites
            ) : (
                <div className="favorite-restaurants">
                    {favorites.map((restaurant) => (  // Map over favorites array to display each restaurant
                        <div key={restaurant.id} className="favorite-restaurant">
                            <h3>{restaurant.name}</h3>  // Display restaurant name
                            <p>{restaurant.description}</p>  // Display restaurant description
                            <p><strong>Location:</strong> {restaurant.location}</p>  // Display restaurant location
                            <button
                                className="remove-favorite-button"
                                onClick={() => removeFavorite(restaurant.id)}  // Remove favorite on button click
                            >
                                Remove from Favorites
                            </button>
                            <Link to={`/brands/${restaurant.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                                <button className="view-details-button">View Details</button>  // Button to view details of the restaurant
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;  // Export the Favorites component as the default export
