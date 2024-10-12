import React from 'react';
import SignUp from './components/SignUp';
import Login from './components/Login.js';
import Logout from './components/Logout';


const App = () => {
    return (
        <div>
            <h1>Uber Eats - Customer Portal</h1>
            <SignUp />
            <Login />
            <center><button onClick={Logout}>Logout</button></center>
        </div>

        //  <Router>
        //     <Routes>
        //         <Route path="/login" element={<Login />} />
        //         <Route path="/userdash" element={<UserDashboard />} />
        //         {/* Add other routes here */}
        //     </Routes>
        // </Router>
    );
};

export default App;