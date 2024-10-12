// src/components/MainLogin.js
import React from 'react';
import Login from './Login';
import SignUp from './SignUp';
import './MainLogin.css';

const MainLogin = () => {
    return (
        <div className="main-login-container">
            <div className="form-container">
                <SignUp/>
            </div>
            <div className="form-container">
                <Login />
            </div>
        </div>
    );
};

export default MainLogin;
