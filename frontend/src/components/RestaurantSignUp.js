import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';

const RestaurantSignUp = () => {
    const navigate = useNavigate();
    const [restaurantData, setRestaurantData] = useState({
        username: '',
        email: '',
        password: '',
        restaurant_name: '',
        location: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    // Handle input change
    const handleChange = (e) => {
        setRestaurantData({
            ...restaurantData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submit
    const handleRestaurantSignUpSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear any previous error message

        try {
            await axios.post('http://localhost:8000/api/restaurants/signup/', restaurantData);
            alert('Sign-up successful');
            navigate('/login'); // Redirect to the login page after successful sign-up
        } catch (error) {
            if (error.response && error.response.data) {
                console.error('Sign-up failed:', error.response.data);  // Log detailed error from backend
                let message = 'Sign-up failed. Please check your details and try again.';

                // Parse backend response for specific errors
                if (error.response.data.username) {
                    message = 'Username is already taken. Please try another.';
                } else if (error.response.data.email) {
                    message = 'Email is already registered. Please use a different email.';
                }

                setErrorMessage(message); // Set the error message to display on the page
                alert(message); // Optionally show an alert with the error message
            } else {
                console.error('Sign-up failed:', error);
                setErrorMessage('An unexpected error occurred. Please try again later.');
                alert('An unexpected error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="signup-container">
            <header className="signup-header">
                <Link to="/home" className="brand-title">Uber <span>Business</span></Link>
            </header>
            <form className="signup-form" onSubmit={handleRestaurantSignUpSubmit}>
                <h3>Restaurant Sign Up</h3>
                <input 
                    type="text" 
                    name="username" 
                    onChange={handleChange} 
                    placeholder="Username" 
                    required 
                />
                <input 
                    type="text" 
                    name="restaurant_name" 
                    onChange={handleChange} 
                    placeholder="Restaurant Name" 
                    required 
                />
                <input 
                    type="text" 
                    name="location" 
                    onChange={handleChange} 
                    placeholder="Location" 
                    required 
                />
                <input 
                    type="email" 
                    name="email" 
                    onChange={handleChange} 
                    placeholder="Email" 
                    required 
                />
                <input 
                    type="password" 
                    name="password" 
                    onChange={handleChange} 
                    placeholder="Password" 
                    required 
                />
                
                <button type="submit" className="continue-button">Sign Up</button>

                {/* Display error message below the form */}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
        </div>
    );
};

export default RestaurantSignUp;
