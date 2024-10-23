import React from 'react';
// import { useState } from 'react';
// import axios from 'axios';
import './SignUp.css';
import {Link} from 'react-router-dom';
import CustomerSignUp from './CustomerSignUp';
import RestaurantSignUp from './RestaurantSignUp';

const SignUp = () => {
    // // const navigate = useNavigate();
    // const [formData, setFormData] = useState({
    //     username: '',
    //     name: '',
    //     email: '',
    //     password: ''
    // });

    // const handleChange = (e) => {
    //     setFormData({
    //         ...formData,
    //         [e.target.name]: e.target.value
    //     });
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await axios.post('http://localhost:8000/api/customers/signup/', formData);
    //         console.log('Response from server:', response.data);
    //         alert('Registration successful');
    //         navigate('home/');
    //     } catch (error) {
    //         console.error('Registration failed:', error);
    //     }
    // };

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
