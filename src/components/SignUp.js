import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { signup } from '../../features/user_slice';
import countrieslist from './countries'; // Assuming this is an array of countries

const SignupForm = () => {
  const [uname, setUname] = useState('');
  const [uaddr, setUaddr] = useState('');
  const [uzip, setUzip] = useState('');
  const [ucontact, setUcontact] = useState('');
  const [upwd, setUpwd] = useState('');
  const [uemail, setUemail] = useState('');
  const [ucpwd, setUcpwd] = useState('');
  const [udp, setUdp] = useState('');
  const [ucity, setUcity] = useState('');
  const [ucountry, setUcountry] = useState('');
  const [errors, setErrors] = useState('');
  const [inserted, setInserted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Client-side validation for password match
    if (upwd !== ucpwd) {
      setErrors("Passwords do not match.");
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('username', uname);
    formData.append('email', uemail);
    formData.append('password1', upwd);
    formData.append('password2', ucpwd);
    formData.append('address', uaddr);
    formData.append('zipcode', uzip);
    formData.append('contact', ucontact);
    formData.append('city', ucity);
    formData.append('country', ucountry);
    formData.append('profile_picture', udp);

    // Send POST request to the Django backend
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/signup/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        // Dispatch signup action to Redux
        dispatch(signup({ email: uemail, userType: 'customer' }));
        setInserted(true);
        navigate('/userlogin'); // Redirect to login after successful signup
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors('An error occurred. Please try again.');
      }
    }
  };

  let options = countrieslist.map((country) => (
    <option value={country} key={country}>
      {country}
    </option>
  ));

  return (
    <div>
      <div className="register-form">
        <h2><b>Customer Registration</b></h2>
        <form onSubmit={handleRegister} encType="multipart/form-data">
          {/* Name Field */}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={uname}
              className="form-control"
              placeholder="Your Name"
              onChange={(e) => setUname(e.target.value)}
              required
            />
          </div>

          {/* Address Field */}
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={uaddr}
              className="form-control"
              placeholder="Address"
              onChange={(e) => setUaddr(e.target.value)}
              required
            />
          </div>

          {/* Zipcode Field */}
          <div className="form-group">
            <label>Zipcode</label>
            <input
              type="text"
              value={uzip}
              pattern="[0-9]{5}"
              className="form-control"
              placeholder="Zipcode"
              onChange={(e) => setUzip(e.target.value)}
              required
            />
          </div>

          {/* City and Country Fields */}
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={ucity}
              className="form-control"
              placeholder="City"
              onChange={(e) => setUcity(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Country</label>
            <select
              value={ucountry}
              className="form-control"
              onChange={(e) => setUcountry(e.target.value)}
              required
              style={{ width: '50%' }}
            >
              {options}
            </select>
          </div>

          {/* Contact and Email Fields */}
          <div className="form-group">
            <label>Contact No.</label>
            <input
              type="tel"
              value={ucontact}
              className="form-control"
              placeholder="Your contact number"
              onChange={(e) => setUcontact(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={uemail}
              className="form-control"
              placeholder="Your email address"
              onChange={(e) => setUemail(e.target.value)}
              required
            />
          </div>

          {/* Password Fields */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={upwd}
              className="form-control"
              onChange={(e) => setUpwd(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={ucpwd}
              className="form-control"
              onChange={(e) => setUcpwd(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </div>

          {/* Profile Picture Upload */}
          <div className="form-group">
            <label>Upload Profile Picture</label>
            <input
              type="file"
              onChange={(e) => setUdp(e.target.files[0])}
              accept=".png,.gif,.jpeg,.jpg"
            />
          </div>

          <h4 style={{ color: 'red' }}>{errors}</h4>

          <button type="submit" className="btn btn-dark">Register</button>
          <br />
          Already have an account? <Link to="/userlogin">Login</Link>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
