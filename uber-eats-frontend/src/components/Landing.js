import './Landing.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';
import Login from './Login';



const Landing = () => {
    return (
        <div className="landing-container">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="navbar-left">
                    <button className="menu-button">☰</button>
                    <h2 className="brand-title">Uber Eats</h2>
                </div>
                <div className="navbar-right">
                    <button className="login-button">Log in</button>
                    <button className="signup-button">Sign up</button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <h1>Order delivery near you</h1>

                {/* Address Input Section */}
                <div className="address-input-section">
                    <div className="input-box">
                        <FaMapMarkerAlt className="icon" />
                        <input type="text" placeholder="Enter delivery address" />
                    </div>
                    <div className="delivery-time-dropdown">
                        <AiOutlineClockCircle className="icon" />
                        <select>
                            <option>Deliver now</option>
                            <option>Schedule for later</option>
                        </select>
                    </div>
                    <button className="search-button">Search here</button>
                </div>

                {/* Sign In Link */}
                <p className="signin-link">
    Or <button className="link-button" onClick={() => {<Login/>}}>Sign In</button>
</p>


            </header>
        </div>
    );
};

export default Landing; 