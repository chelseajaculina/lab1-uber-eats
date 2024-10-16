import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Logout from './components/Logout';
import MainLogin from './components/MainLogin';
import UserDashboard from './components/UserDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Navbar from './components/Navbar';
import Landing from './components/Landing';


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
            {/* <Navbar/> */}
            <MainLayout>
                <Routes>
                    <Route path="/" element={<Landing/>} />
                    <Route path="/home" element= {<Home />} /> 
                    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/logout" element={<Logout/>} />
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/userdashboard" element={isAuthenticated ? <UserDashboard /> : <Navigate to="/login" />} />
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