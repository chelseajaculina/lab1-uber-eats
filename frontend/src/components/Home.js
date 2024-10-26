import React, { useState, useEffect } from 'react';
import './Home.css';
import NavBarHome from './NavBarHome';
//import { Link } from 'react-router-dom';
import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const Home = () => {
    const [isLoggedIn] = useState(false);
    //const [restaurants, setRestaurants] = useState([]);
    const [favorites, setFavorites] = useState([]);
    

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user-dashboard-brands/');
                console.log(response.data);
                //setRestaurants(response.data);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            }
        };

        const fetchFavorites = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8000/api/customers/favorites/', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setFavorites(response.data.map(fav => fav.restaurant));
                } catch (error) {
                    console.error('Error fetching favorite restaurants:', error);
                }
            }
        };

        fetchRestaurants();
        fetchFavorites();
    }, []);
    const handleFavoriteClick = async (brandId) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Please log in to add favorites.');
            return;
        }
    
        try {
            if (favorites.some(fav => fav.id === brandId)) {
                console.log('Removing from favorites');
                // Remove from favorites
                await axios.delete(`http://localhost:8000/api/customers/favorites/${brandId}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFavorites(favorites.filter(fav => fav.id !== brandId));
            } else {
                // Add to favorites
                console.log('Adding to favorites');
                const response = await axios.post(
                    'http://localhost:8000/api/customers/favorites/',
                    { brand_id: brandId }, // Assuming the backend expects 'brand_id'
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setFavorites([...favorites, response.data]);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };
    

    return (
        <div className="home-container">
            {!isLoggedIn && (<NavBarHome />)}

            <div className="categories-scroll">
                {["Grocery", "Breakfast", "Fast Food", "Burgers", "Pizza", "Mexican", "Wings", "Dessert", "Sushi", "BubbleTea"].map((category) => (
                    <div key={category} className="category-item">
                        <img src={`${process.env.PUBLIC_URL}/images/${category.toLowerCase()}.png`} alt={category} />
                        <span>{category}</span>
                    </div>
                ))}
            </div>

            <div className="promotions">
                <div className="promotion-card">
                    <h3>$15 off when you invite your friends</h3>
                    <button className="promotion-button">Invite & earn</button>
                </div>
                <div className="promotion-card">
                    <h3>$0 Delivery Fee + up to 10% off with Uber One</h3>
                    <button className="promotion-button">Try free for 4 weeks</button>
                </div>
                <div className="promotion-card">
                    <h3>Check out gameday deals</h3>
                    <button className="promotion-button">Shop deals</button>
                </div>
            </div>

            <div className="brands-section">
                <h2>National brands</h2>
                <div className="brands">
                    {[
                        { id: 1, name: "McDonald's", deliveryFee: "Higher Delivery Fee", time: "20-35 min", rating: 4.5 },
                        { id: 2, name: "Jack in the Box", deliveryFee: "Low Delivery Fee", time: "10-20 min", rating: 4.5 },
                        { id: 3, name: "Panda Express", deliveryFee: "Moderate Delivery Fee", time: "15-30 min", rating: 4.5 },
                        { id: 4, name: "Wingstop", deliveryFee: "Moderate Delivery Fee", time: "10-25 min", rating: 4.6 },
                        { id: 5, name: "Taco Bell", deliveryFee: "Moderate Delivery Fee", time: "10-25 min", rating: 4.6 },
                    ].map((brand) => (
                        <div key={brand.name} className="brand-card">
                            <img src={
                                `${process.env.PUBLIC_URL}/images/${brand.name
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')
                                    .replace(/[^a-z0-9-]/g, '')
                                }.jpeg`
                            }
                            alt={brand.name} />
                            <h3>
                                <a href={`/brands/${brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                                    {brand.name}
                                </a>
                            </h3>
                            <p>{brand.deliveryFee}</p>
                            <p>{brand.time}</p>
                            <p>Rating: {brand.rating}</p>
                            <button
                                className="favorite-button"
                                onClick={() => handleFavoriteClick(brand.id)}
                            >
                                {favorites.some(fav => fav.id === brand.id) ? (
                                    <FaHeart color="red" />
                                ) : (
                                    <FaRegHeart />
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
