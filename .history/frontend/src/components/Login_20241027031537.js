import React from 'react';
import './Login.css';
import CustomerLogin from './CustomerLogin';
import RestaurantLogin from './RestaurantLogin';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div>
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="navbar-left">
                    <Link to="/home" className="brand-title"> <span>Eats</span></Link>
                </div>
                <div className="navbar-right">
                    <Link to="/login">
                        <button className="login-button">Log in</button>
                    </Link>
                    <Link to="/signup">
                        <button className="signup-button">Sign up</button>
                    </Link>
                </div>
            </nav>

            {/* Login Content */}
            <div className="login-container">
                <div className="login-forms">
                    {/* Customer Login Form */}
                    <div className="form-container">
                        <CustomerLogin />
                    </div>

                    {/* Restaurant Login Form */}
                    <div className="form-container">
                        <RestaurantLogin />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
