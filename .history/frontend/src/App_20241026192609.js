import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import components
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Logout from './components/Logout';
import CustomerProfile from './components/CustomerProfile';
import Welcome from './components/Welcome';
import RestaurantTab from './components/RestaurantTab';
import RestaurantSignUp from './components/RestaurantSignUp';
import RestaurantLogin from './components/RestaurantLogin';
import CustomerLogin from './components/CustomerLogin';
import CustomerSignUp from './components/CustomerSignUp';
import Favorites from './components/Favorites';
import RestaurantDashboard from './components/RestaurantDashboard';
import RestaurantProfile from './components/RestaurantProfile';
import OrdersManagement from './components/OrdersManagement';
import PandaExpress from './components/brands/PandaExpress';
import RestaurantMenu from './components/RestaurantMenu';
import RestaurantPage from './components/RestaurantPage';
import RestaurantList from './components/RestaurantList';
import ViewCart from './components/ViewCart';

const App = () => {
    // State to manage user authentication
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check for token in local storage to set authentication status
    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        setIsAuthenticated(!!accessToken); // Set to true if accessToken exists, otherwise false
    }, []);

    return (
        <Router>
            <MainLayout>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Welcome />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />

                    {/* Customer Routes */}
                    <Route path="/customer/signup" element={<CustomerSignUp />} />
                    <Route path="/customer/login" element={<CustomerLogin />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/customerprofile" element={isAuthenticated ? <CustomerProfile /> : <Navigate to="/login" />} />

                    {/* Restaurant Routes */}
                    <Route path="/restaurant/signup" element={<RestaurantSignUp />} />
                    <Route path="/restaurant/login" element={<RestaurantLogin />} />
                    <Route path="/restaurantdashboard" element={isAuthenticated ? <RestaurantDashboard /> : <Navigate to="/restaurant/login" />} />
                    <Route path="/restaurantprofile" element={isAuthenticated ? <RestaurantProfile /> : <Navigate to="/restaurant/login" />} />
                    <Route path="/restaurantmenu" element={isAuthenticated ? <RestaurantMenu /> : <Navigate to="/restaurant/login" />} />
                    <Route path="/orders" element={isAuthenticated ? <OrdersManagement /> : <Navigate to="/restaurant/login" />} />
                    <Route path="/restauranttab" element={<RestaurantTab />} />
                    <Route path="/restaurants" element={<RestaurantList />} />

                    {/* Dynamic Brand Routes */}
                    <Route path="/brands/:restaurantName" element={<RestaurantPage />} />

                    {/* Miscellaneous Routes */}
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/welcome" element={<Welcome />} />

                    {/* Static Brand Page Example */}
                    <Route path="/brands/panda-express" element={<PandaExpress />} />

                    {/* View Cart Route */}
                    <Route path="/cart" element={<ViewCart />} />
                </Routes>
            </MainLayout>
        </Router>
    );
};

// Main layout wrapper component
const MainLayout = ({ children }) => (
    <div>
        {/* You can add a navbar or footer here if needed */}
        {children}
    </div>
);

export default App;
