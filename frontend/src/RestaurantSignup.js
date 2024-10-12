// frontend/src/RestaurantSignup.js
import React, { useState } from 'react';
import './App.css'; // Ensure this imports your CSS for styling

const RestaurantSignup = () => {
    const [formData, setFormData] = useState({
        storeAddress: '',
        storeName: '',
        brandName: '',
        businessType: '',
        firstName: '',
        lastName: '',
        email: '',
        mobilePhoneNumber: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/restaurant/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Handle successful signup (redirect, show message, etc.)
                alert('Signup successful!');
            } else {
                // Handle errors
                alert('Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during signup:', error);
        }
    };

    return (
        <div className="signup-container">
            <h1>Get started</h1>
            <form onSubmit={handleSubmit} className="signup-form">
                <input
                    type="text"
                    name="storeAddress"
                    placeholder="Store address"
                    value={formData.storeAddress}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="storeName"
                    placeholder="Store name"
                    value={formData.storeName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="brandName"
                    placeholder="Brand name"
                    value={formData.brandName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="businessType"
                    placeholder="Business type"
                    value={formData.businessType}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="tel"
                    name="mobilePhoneNumber"
                    placeholder="Mobile phone number"
                    value={formData.mobilePhoneNumber}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="signup-btn">Submit</button>
            </form>
        </div>
    );
};

export default RestaurantSignup;
