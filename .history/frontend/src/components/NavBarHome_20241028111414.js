import React, { useState, useEffect, useContext } from 'react';
import './NavBar.css';
import axios from 'axios';
import {
    FaBars, FaMapMarkerAlt, FaShoppingCart, FaSearch,
    FaRegBookmark, FaWallet, FaUtensils, FaLifeRing, FaCar, FaGift, FaRegGrinHearts, FaApple, FaAndroid, FaTimes
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Logout from '../components/Logout';
import CartContext from '../contexts/CartContext';
import CartModal from '../components/CartModal';

const NavBarHome = () => {
    const navigate = useNavigate();
    const mediaBaseURL = 'http://127.0.0.1:8000/media/';
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [name, setName] = useState('');
    const [profilePicture, setProfilePicture] = useState(localStorage.getItem("profilePicture") || "");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('San Jose State University');
    const [activeButton, setActiveButton] = useState('delivery');

    const { cart, addToCart, incrementItem, decrementItem } = useContext(CartContext);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('profilePicture');
        setIsLoggedIn(false);
        setName('');
        setProfilePicture('');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsLoggedIn(true);
            c
