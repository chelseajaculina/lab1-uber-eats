import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupForm from './components/SignupForm'; // Import the SignupForm component
import UserLogin from './components/UserLogin';  // Import the Login component (create this if you haven't)
import UserDashboard from './components/UserDashboard'; // Import the Dashboard component (create this if you haven't)
import NavBar from './components/NavBar'; // Optional: Import your NavBar component

function App() {
  return (
    <Router>
      {/* Navbar will be displayed across all pages */}
      <NavBar />

      <div className="app-container">
        <Routes>
          {/* Define routes for different pages */}
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/userlogin" element={<UserLogin />} />
          <Route path="/userdash" element={<UserDashboard />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="home-container">
      <h2>Welcome to Uber Eats Clone</h2>
      <p>This is the homepage. Navigate to other pages using the links above.</p>
    </div>
  );
}

export default App;
