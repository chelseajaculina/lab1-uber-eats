import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Logout from './components/Logout';
import UserDashboard from './components/UserDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import Welcome from './components/Welcome';
import RestaurantTab from './components/RestaurantTab';
import RestaurantSignUp from './components/RestaurantSignUp';
import RestaurantLogin from './components/RestaurantLogin';
import CustomerLogin from './components/CustomerLogin';
import CustomerSignUp from './components/CustomerSignUp';
import Favorites from './components/Favorites';



const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<Welcome/>} />
                    <Route path="/home" element= {<Home />} /> 
                    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />


                    <Route path="customer/signup" element={<CustomerSignUp />} />
                    <Route path="customer/login" element={<CustomerLogin />} />

                    <Route path="/signup" element={<SignUp />} />


                    <Route path="restaurant/signup" element={<RestaurantSignUp />} />
                    <Route path="restaurant/login" element={<RestaurantLogin/>} />

                    <Route path="/favorites" element={<Favorites />} />

                    <Route path="/logout" element={<Logout/>} />
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/userdashboard" element={isAuthenticated ? <UserDashboard /> : <Navigate to="/userdashboard" />} />
                    <Route path="/restauranttab" element={<RestaurantTab />} />
                    {/* Add other routes here */}
                </Routes>
            </MainLayout>
        </Router>
    );
};


const MainLayout = ({ children }) => (
    <div>
        {children}
    </div>
);


export default App;