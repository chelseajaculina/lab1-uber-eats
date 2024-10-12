import axios from 'axios';

const logout = async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    const access_token = localStorage.getItem('access_token');

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
        alert('Logged out successfully.');
    } catch (error) {
        console.error('Logout failed:', error);
        if (error.response && error.response.data && error.response.data.detail) {
            alert(`Logout failed: ${error.response.data.detail}`);
        } else {
            alert('Logout failed due to a network or server issue. Please try again.');
        }
    }
};

export default logout;
