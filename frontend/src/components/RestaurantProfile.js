import React, { Component } from 'react';
import axios from 'axios';
import './RestaurantProfile.css';
import { Link } from 'react-router-dom';

class RestaurantProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurant: {
                name: localStorage.getItem('restaurantName') || '',
                location: localStorage.getItem('restaurantLocation') || '',
                description: localStorage.getItem('restaurantDescription') || '',
                email: localStorage.getItem('restaurantEmail') || '',
                phone: localStorage.getItem('restaurantPhone') || '',
                contact_info: localStorage.getItem('restaurantContactInfo') || '',
                profilePicture: localStorage.getItem('restaurantProfilePicture') || ''
            },
            authToken: localStorage.getItem('access_token'),
            refreshToken: localStorage.getItem('refresh_token'),
            selectedProfilePicture: null,
            previewProfilePicture: localStorage.getItem('restaurantProfilePicture') || ''
        };

        // Base URL for accessing media files (update this to match your backend configuration)
        this.mediaBaseURL = 'http://localhost:8000/media/';
    }

    // Method to refresh authentication token
    refreshAuthToken = async (callback) => {
        try {
            const response = await axios.post('http://localhost:8000/api/restaurants/token/refresh/', {
                refresh: this.state.refreshToken
            });
            const newAccessToken = response.data.access;
            localStorage.setItem('access_token', newAccessToken);
            this.setState({ authToken: newAccessToken }, callback);
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    };

    // Fetch restaurant details from the backend
    fetchRestaurantDetails = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/restaurants/me/', {
                headers: { Authorization: `Bearer ${this.state.authToken}` }
            });
            const restaurantData = response.data;

            // Save to state and local storage for persistence
            this.setState({
                restaurant: {
                    ...restaurantData
                },
                previewProfilePicture: restaurantData.profile_picture ? `${this.mediaBaseURL}${restaurantData.profile_picture}` : ''
            });

            localStorage.setItem('restaurantName', restaurantData.name || '');
            localStorage.setItem('restaurantLocation', restaurantData.location || '');
            localStorage.setItem('restaurantDescription', restaurantData.description || '');
            localStorage.setItem('restaurantEmail', restaurantData.email || '');
            localStorage.setItem('restaurantPhone', restaurantData.phone || '');
            localStorage.setItem('restaurantContactInfo', restaurantData.contact_info || '');
            if (restaurantData.profile_picture) {
                localStorage.setItem('profilePicture', `${this.mediaBaseURL}${restaurantData.profile_picture}`);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                await this.refreshAuthToken(this.fetchRestaurantDetails);
            } else {
                console.error('Error fetching restaurant data:', error);
            }
        }
    };

    componentDidMount() {
        this.fetchRestaurantDetails();
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            restaurant: {
                ...prevState.restaurant,
                [name]: value
            }
        }));

        // Update local storage to maintain the data across refreshes
        localStorage.setItem(`restaurant${name.charAt(0).toUpperCase() + name.slice(1)}`, value);
    };

    handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            this.setState({ selectedProfilePicture: file });
            const previewUrl = URL.createObjectURL(file);
            this.setState({ previewProfilePicture: previewUrl });
        } else {
            console.error("No file selected");
        }
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Append all restaurant fields except profile picture to formData
        Object.keys(this.state.restaurant).forEach(key => {
            if (key !== 'profilePicture' && this.state.restaurant[key]) {
                formData.append(key, this.state.restaurant[key]);
            }
        });

        // Append profile picture only if it has been changed
        if (this.state.selectedProfilePicture instanceof File) {
            formData.append('profile_picture', this.state.selectedProfilePicture);
        }

        try {
            // Send the patch request to update the restaurant profile
            const response = await axios.patch('http://localhost:8000/api/restaurants/update/', formData, {
                headers: {
                    Authorization: `Bearer ${this.state.authToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update state and local storage if profile picture is changed
            if (response.data.profile_picture) {
                const updatedProfilePicture = `${this.mediaBaseURL}${response.data.profile_picture}?timestamp=${new Date().getTime()}`;
                localStorage.setItem('restaurantProfilePicture', updatedProfilePicture);
                this.setState({
                    restaurant: { ...this.state.restaurant, profilePicture: updatedProfilePicture },
                    previewProfilePicture: updatedProfilePicture
                });
            }

            // Update the rest of the restaurant fields in the state and local storage
            this.setState(prevState => {
                const updatedRestaurant = {
                    ...prevState.restaurant,
                    name: response.data.name,
                    location: response.data.location,
                    description: response.data.description,
                    email: response.data.email,
                    phone: response.data.phone,
                    contact_info: response.data.contact_info
                };
                
                // Update local storage with the new values
                localStorage.setItem('restaurantName', updatedRestaurant.name);
                localStorage.setItem('restaurantLocation', updatedRestaurant.location);
                localStorage.setItem('restaurantDescription', updatedRestaurant.description);
                localStorage.setItem('restaurantEmail', updatedRestaurant.email);
                localStorage.setItem('restaurantPhone', updatedRestaurant.phone);
                localStorage.setItem('restaurantContactInfo', updatedRestaurant.contact_info);

                return {
                    restaurant: updatedRestaurant
                };
            });

            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(`Error: ${error.message}`);
        }
    };

    render() {
        return (
            <div className="dashboard-container">
                <aside className="sidebar">
                    <Link to="/home"><h2>Uber Restaurant Account</h2></Link>
                    <ul>
                        <li className="active">Account Info</li>
                        <li>Menu Management</li>
                        <li>Orders Management</li>
                        <li>Analytics</li>
                    </ul>
                </aside>

                <main className="content">
                    <h1>{this.state.restaurant.name ? `${this.state.restaurant.name} Account Info` : "Restaurant Account Info"}</h1>

                    <div className="profile-section">
                        <label>Profile Picture:</label><br />
                        {this.state.previewProfilePicture ? (
                            <div>
                                <img src={this.state.previewProfilePicture} alt="Current Profile" className="profile-picture" />
                            </div>
                        ) : (
                            <p>No profile picture available.</p>
                        )}
                        
                        <label>Change:</label><br />
                        <input
                            type="file"
                            className="profile-picture-input"
                            onChange={this.handleProfilePictureChange}
                            accept=".png,.jpg,.jpeg,.gif"
                        />
                        <button onClick={this.handleSubmit} className="profile-picture-btn">
                            Update Profile Picture
                        </button>
                    </div>

                    <form onSubmit={this.handleSubmit}>
                        {/* Rest of the form fields */}
                        <div>
                            <label>Restaurant Name:</label>
                            <input type="text" name="name" value={this.state.restaurant.name} onChange={this.handleInputChange} placeholder="Enter Restaurant Name" />
                        </div>
                        <div>
                            <label>Location:</label>
                            <input type="text" name="location" value={this.state.restaurant.location} onChange={this.handleInputChange} placeholder="Enter Location" />
                        </div>
                        <div>
                            <label>Description:</label>
                            <textarea name="description" value={this.state.restaurant.description} onChange={this.handleInputChange} placeholder="Enter Description"></textarea>
                        </div>
                        <div>
                            <label>Email:</label>
                            <input type="email" name="email" value={this.state.restaurant.email} onChange={this.handleInputChange} placeholder="Enter Email" />
                        </div>
                        <div>
                            <label>Contact Info:</label>
                            <input type="text" name="contact_info" value={this.state.restaurant.contact_info} onChange={this.handleInputChange} placeholder="Enter Contact Info" />
                        </div>
                        <button type="submit">Update Profile</button>
                    </form>
                </main>
            </div>
        );
    }
}

export default RestaurantProfile;