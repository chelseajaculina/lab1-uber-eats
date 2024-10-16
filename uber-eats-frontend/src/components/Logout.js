import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');

  if (!refresh_token) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post('http://localhost:8000/api/customers/token/refresh/', {
      refresh: refresh_token,
    });

    localStorage.setItem('access_token', response.data.access);
    return response.data.access;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    let access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');

    if (!refresh_token || !access_token) {
      alert('You are not logged in. Please log in to continue.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/api/customers/logout/',
        { refresh: refresh_token },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      // Remove tokens from localStorage after a successful logout
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      console.log('Logged out successfully.');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);

      if (error.response && error.response.data && error.response.data.detail === 'Given token not valid for any token type') {
        try {
          access_token = await refreshToken();
          await axios.post(
            'http://localhost:8000/api/customers/logout/',
            { refresh: refresh_token },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
              },
            }
          );

          // Remove tokens from localStorage after a successful logout
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          alert('You have successfully logged out.');
          console.log('Logged out successfully.');
          navigate('/');
        } catch (refreshError) {
          console.error('Logout failed after token refresh:', refreshError);
          alert('Logout failed after token refresh. Please try again.');
        }
      } else {
        alert('Logout failed due to a network or server issue. Please try again.');
      }
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;