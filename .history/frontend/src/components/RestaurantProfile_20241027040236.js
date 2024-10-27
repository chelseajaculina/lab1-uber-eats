import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './RestaurantProfile.css';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

class RestaurantProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurant: {
                restaurant_name: '',
                location: '',
                description: '',
                contact_info: '',
                email: '',
                timings: '',
                profilePicture: localStorage.getItem('restaurantProfilePicture') || ''
            },
            dishes: [], // Assuming this is where dish data will be loaded
            favorites: {}, // Track favorite status for each dish by ID
            authToken: localStorage.getItem('access_token'),
            refreshToken: localStorage.getItem('refresh_token'),
        };
        this.mediaBaseURL = 'http://localhost:8000/media/';
    }

    // Function to toggle favorite status
    toggleFavorite = (dishId) => {
        this.setState((prevState) => ({
            favorites: {
                ...prevState.favorites,
                [dishId]: !prevState.favorites[dishId], // Toggle the favorite status
            },
        }));
    };

    fetchDishes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/restaurants/dishes/', {
                headers: { Authorization: `Bearer ${this.state.authToken}` },
            });
            this.setState({ dishes: response.data });
        } catch (error) {
            console.error('Error fetching dishes:', error);
        }
    };

    componentDidMount() {
        this.fetchDishes();
    }

    render() {
        return (
            <div className="dashboard-container">
                <aside className="sidebar">
                    <Link to="/restaurantdashboard"><h2>Uber Restaurant Account</h2></Link>
                    <div>
                        <img src={this.state.restaurant.profilePicture} alt="Current Profile" className="profile-picture" />
                    </div>
                    <ul>
                        <li className="active">Account Info</li>
                        <li>Menu Management</li>
                        <li>Orders Management</li>
                        <li>Analytics</li>
                    </ul>
                </aside>

                <main className="content">
                    <div className="dishes-section">
                        <h3>Dishes</h3>
                        <div className="dishes-list">
                            {this.state.dishes.map((dish) => (
                                <div key={dish.id} className="dish-card">
                                    <img
                                        src={`${this.mediaBaseURL}${dish.image}`}
                                        alt={dish.name}
                                        className="dish-image"
                                    />
                                    <div className="dish-info">
                                        <h4>{dish.name}</h4>
                                        <p>{dish.description}</p>
                                        <p>${dish.price}</p>
                                    </div>
                                    <button
                                        className="favorite-icon"
                                        onClick={() => this.toggleFavorite(dish.id)}
                                    >
                                        {this.state.favorites[dish.id] ? (
                                            <FaHeart className="heart-icon filled" />
                                        ) : (
                                            <FaRegHeart className="heart-icon" />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default RestaurantProfile;
