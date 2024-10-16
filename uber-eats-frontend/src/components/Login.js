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
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <input type="text" name="username" onChange={handleChange} placeholder="Username" required />
            <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;