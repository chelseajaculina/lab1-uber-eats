import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [newRestaurant, setNewRestaurant] = useState('');
    const [error, setError] = useState(null);

    const apiBaseUrl = 'http://localhost:8000';  // Adjust this to your Django server's base URL

    // Fetch all restaurants
    const fetchRestaurants = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/restaurants/`);
            setRestaurants(response.data);
        } catch (error) {
            setError('Error fetching restaurants');
        }
    };

    // Add a new restaurant
    const addRestaurant = async () => {
        try {
            const response = await axios.post(`${apiBaseUrl}/restaurants/`, { name: newRestaurant });
            setRestaurants([...restaurants, response.data]);
            setNewRestaurant(''); // Reset input field
        } catch (error) {
            setError('Error adding restaurant');
        }
    };

    // Update a restaurant
    const updateRestaurant = async (id, updatedData) => {
        try {
            await axios.put(`${apiBaseUrl}/restaurants/${id}/`, updatedData);
            fetchRestaurants(); // Refresh the list after updating
        } catch (error) {
            setError('Error updating restaurant');
        }
    };

    // Delete a restaurant
    const deleteRestaurant = async (id) => {
        try {
            await axios.delete(`${apiBaseUrl}/restaurants/${id}/`);
            setRestaurants(restaurants.filter((restaurant) => restaurant.id !== id));
        } catch (error) {
            setError('Error deleting restaurant');
        }
    };

    // Fetch restaurants on component mount
    useEffect(() => {
        fetchRestaurants();
    }, []);

    return (
        <div>
            <h1>Restaurant List</h1>
            {error && <p>{error}</p>}
            <ul>
                {restaurants.map((restaurant) => (
                    <li key={restaurant.id}>
                        {restaurant.name}
                        <button onClick={() => deleteRestaurant(restaurant.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                value={newRestaurant}
                onChange={(e) => setNewRestaurant(e.target.value)}
                placeholder="New restaurant name"
            />
            <button onClick={addRestaurant}>Add Restaurant</button>
        </div>
    );
};

export default RestaurantList;
