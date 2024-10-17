import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './UserDashboard.css';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    // Initialize user state with localStorage to persist profile picture across sessions
    const [user, setUser] = useState({
        name: '',
        dateOfBirth: '',
        city: '',
        state: '',
        country: '',
        nickname: '',
        email: '',
        phone: '',
        profilePicture: localStorage.getItem('profilePicture') || '', // Retrieve from localStorage
        favorites: []
    });

    const [countries, setCountries] = useState([]);
    const [authToken, setAuthToken] = useState(localStorage.getItem('access_token'));
    const refreshToken = localStorage.getItem('refresh_token');
    const [selectedProfilePicture, setSelectedProfilePicture] = useState(null);
    const [previewProfilePicture, setPreviewProfilePicture] = useState(localStorage.getItem('profilePicture') || ''); // Retrieve from localStorage

    // Function to refresh authentication token
    const refreshAuthToken = useCallback(async (callback) => {
        try {
            const response = await axios.post('http://localhost:8000/api/customers/token/refresh/', {
                refresh: refreshToken
            });
            const newAccessToken = response.data.access;
            localStorage.setItem('access_token', newAccessToken);
            setAuthToken(newAccessToken);
            if (callback) callback();
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    }, [refreshToken]);

    // Fetch user details from the backend
    const fetchUserDetails = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/customers/me/', {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            const userData = response.data;

            // Update user state and store profile picture URL to localStorage
            setUser(userData);
            setPreviewProfilePicture(userData.profilePicture);
            if (userData.profilePicture) {
                localStorage.setItem('profilePicture', userData.profilePicture); // Save to localStorage
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                await refreshAuthToken(fetchUserDetails);
            } else {
                console.error('Error fetching user data:', error);
            }
        }
    }, [authToken, refreshAuthToken]);

    // Fetch list of countries
    const fetchCountries = useCallback(async () => {
        try {
            const response = await axios.get('https://restcountries.com/v3.1/all');
            const sortedCountries = response.data.map(country => country.name.common).sort();
            setCountries(sortedCountries);
        } catch (error) {
            console.error('Error fetching countries data:', error);
            setCountries([]);
        }
    }, []);

    useEffect(() => {
        fetchUserDetails();
        fetchCountries();
    }, [fetchUserDetails, fetchCountries]);

    // Handle input changes for profile fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle profile picture change to create a preview
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        setSelectedProfilePicture(file);

        // Create a preview URL for the selected file
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviewProfilePicture(previewUrl); // Update preview in state
        }
    };

    // Handle profile picture upload
    const handleProfilePictureSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProfilePicture) return alert("Please choose a file before updating.");
    
        const formData = new FormData();
        formData.append('profile_picture', selectedProfilePicture);
    
        try {
            // Make the API request to upload the profile picture
            const response = await axios.post('http://localhost:8000/api/customers/upload-profile-picture/', formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            // Debugging: Log the response URL from the server
            console.log('Profile picture URL returned from server:', response.data.profilePicture);
    
            // Update the profile picture in state
            let updatedProfilePicture = response.data.profilePicture;
    
            // Add a timestamp to prevent caching of the old image
            updatedProfilePicture += `?timestamp=${new Date().getTime()}`;
    
            // Update user state, preview, and localStorage
            setUser(prevState => ({ ...prevState, profilePicture: updatedProfilePicture }));
            setPreviewProfilePicture(updatedProfilePicture);
            localStorage.setItem('profilePicture', updatedProfilePicture); // Save updated profile picture to localStorage
    
            alert('Profile picture updated successfully');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                await refreshAuthToken(() => handleProfilePictureSubmit(e));
            } else if (error.response && error.response.status === 403) {
                alert('Error uploading profile picture: You do not have permission to perform this action.');
            } else {
                console.error('Error uploading profile picture:', error);
                alert('Error uploading profile picture.');
            }
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedUser = { ...user };
       // delete updatedUser.profilePicture;  // Ensure profile picture is not included in the update request

        try {
            await axios.patch('http://localhost:8000/api/customers/update/', updatedUser, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            alert('Profile updated successfully');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                await refreshAuthToken(() => handleSubmit(e));
            } else if (error.response && error.response.status === 403) {
                alert('Error updating profile: You do not have permission to perform this action.');
            } else {
                alert('Error updating profile: ' + error.message);
                console.error('Error updating profile:', error);
            }
        }
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
               <Link to = "/home"><h2>Uber Account</h2> </Link>
                <ul>
                    <li className="active">Account Info</li>
                    <li>Security</li>
                    <li>Privacy & Data</li>
                </ul>
            </aside>

            {/* Content Section */}
            <main className="content">
                <h1>Account Info</h1>

                {/* Profile Picture Section */}
                <div className="profile-section">
                    {/* Display preview if available; otherwise, display the saved profile picture */}
                    {previewProfilePicture ? (
                        <img src={previewProfilePicture} alt="Profile" className="profile-picture" />
                    ) : (
                        <p>No profile picture available.</p>
                    )}

                    <input
                        type="file"
                        className="profile-picture-input"
                        onChange={handleProfilePictureChange}
                    />
                    <button onClick={handleProfilePictureSubmit} className="profile-picture-btn">
                        Update Profile Picture
                    </button>
                </div>

                {/* Form Section for User Details */}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input type="text" name="name" value={user.name || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Date of Birth:</label>
                        <input type="date" name="dateOfBirth" value={user.dateOfBirth || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>City:</label>
                        <input type="text" name="city" value={user.city || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>State:</label>
                        <input type="text" name="state" value={user.state || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Country:</label>
                        <select name="country" value={user.country || ''} onChange={handleInputChange}>
                            <option value="" disabled>Select a country</option>
                            {countries.map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Nickname:</label>
                        <input type="text" name="nickname" value={user.nickname || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email" value={user.email || ''} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Phone:</label>
                        <input type="tel" name="phone" value={user.phone || ''} onChange={handleInputChange} />
                    </div>
                    <button type="submit">Update Profile</button>
                </form>

                {/* Favorites Section */}
                <div className="favorites-section">
                    <h2>Favorites</h2>
                    <ul>
                        {user.favorites?.map(favorite => (
                            <li key={favorite}>{favorite}</li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
