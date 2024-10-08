import React from 'react';
import './NavBar.css';  // This is where your current CSS goes for the navbar

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="menu-icon.png" alt="menu" className="menu-icon" />
        <h1>Uber <span className="eats">Eats</span></h1>
      </div>
      <div className="navbar-links">
  <a href="/">Delivery</a>
  <a href="/">Pickup</a>
  <a href="/">San Jose State University</a>
  <a href="/signup">Sign Up</a>  {/* Add this link to go to the signup page */}
</div>

      <div className="navbar-search">
        <input type="text" placeholder="Search Uber Eats" />
        <button>Search</button>
      </div>
    </nav>
  );
};

export default NavBar;

