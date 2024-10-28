import React from 'react';
// import { useState } from 'react';
// import axios from 'axios';
import './SignUp.css';
import {Link} from 'react-router-dom';
import CustomerSignUp from './CustomerSignUp';
import RestaurantSignUp from './RestaurantSignUp';

const SignUp = () => {
 
    return (
        <div>
            <div className="signup-header">
                <Link to="/home" className="brand-title">Uber <span>Eats</span></Link>  
            </div>
            <div className="signup-container">
                <div className="signup-forms">
                    {/* Customer Login Form */}
                    <div className="form-container">
                        <CustomerSignUp />
                    </div>

                    {/* Restaurant Login Form */}
                    <div className="form-container">
                        <RestaurantSignUp />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
