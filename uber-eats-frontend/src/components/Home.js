// Home.js
import React from 'react';
import Logout from './Logout';
import UserDashboard from './UserDashboard';

const Home = () => {
    return (
        <div>
            <center><><UserDashboard/></></center>
            <center><><Logout/></></center>
        </div>
    );
};

export default Home;