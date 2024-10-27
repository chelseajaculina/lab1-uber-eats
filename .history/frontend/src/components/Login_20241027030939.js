import React from 'react';
import './Login.css';
import CustomerLogin from './CustomerLogin';
import RestaurantLogin from './RestaurantLogin';
import {Link} from 'react-router-dom';
import NavBar from './NavBar';

const Login = () => {
    return (
        <div>
            <NavBar / >
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
