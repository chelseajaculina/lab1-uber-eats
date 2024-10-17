import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (localStorage.getItem('access_token')) {
            alert('You are already logged in!');
            navigate('/home');  // Redirect to the Home page
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/customers/login/', credentials);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            alert('Login successful');
            navigate('/home');  // Redirect to the Home page
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        
        <div className="login-container">
            <div className="login-header">
                <h1 className="brand-title"> <span> Uber Eats</span></h1>
            </div>
            <form onSubmit={handleSubmit} className="login-form">
                <h1>Login</h1>
                <input type="text" name="username" onChange={handleChange} placeholder="Username" required />
                <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
                <button type="submit" className="continue-button">Login</button>

                <div className="divider">
                    <hr className="line" /> <span>or</span> <hr className="line" />
                </div>
                <button className="google-button" type="button">
                    <img src="/images/google-icon.png" alt="Google Icon" /> Continue with Google
                </button>
                <button className="apple-button" type="button">
                    <img src="/images/apple-icon.png" alt="Apple Icon" /> Continue with Apple
                </button>
                <div className="divider">
                    <hr className="line" /> <span>or</span> <hr className="line" />
                </div>
                <button className="qr-code-button" type="button">
                    <img src="/images/qr-icon.png" alt="QR Icon" /> Log in with QR code
                </button>
                <p className="disclaimer">
                    By proceeding, you consent to get calls, WhatsApp, or SMS/RCS messages, including by automated dialer, from Uber and its affiliates to the number provided. Text "STOP" to 89203 to opt out.
                </p>
            </form>
        </div>
    );
};

export default Login;
