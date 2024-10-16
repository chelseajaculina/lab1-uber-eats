// src/components/MainLogin.js
import React from 'react';
import Login from './Login';
import SignUp from './SignUp';
import './MainLogin.css';

const NavBar = () => {
    return (
        <nav className="navbar">
            <h1 className="navbar-logo">Uber Eats</h1>
            <ul className="navbar-links">
                <li><a href="login/">Login</a></li>
                <li><a href="signup/">Sign Up</a></li>
                <li><a href="/">Logout</a></li>
            </ul>
        </nav>
    );
};

const MainLogin = () => {
    return (
        <div>
            <NavBar />
            <div className="main-login-container">
                <div className="form-container" id="signup">
                    <SignUp />
                </div>
                <div className="form-container" id="login">
                    <Login />
                </div>
               
            </div>
        </div>
    );
};

export default MainLogin;
