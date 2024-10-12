import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Logout from './components/Logout';
import MainLogin from './components/MainLogin';

const MainLayout = ({ children }) => (
    <div>
        {/* <Navbar /> */}
        {children}
    </div>
);

const App = () => {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<MainLogin />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/logout" element={<Logout />} />
                    {/* Add other routes here */}
                </Routes>
            </MainLayout>
        </Router>
    );
};

export default App;