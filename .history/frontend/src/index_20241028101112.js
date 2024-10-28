import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { CartProvider } from './CartContext'; // Import CartProvider
import './index.css'; // Import your main CSS file if applicable

// Wrap the App component with CartProvider
ReactDOM.render(
    <CartProvider>
        <App />
    </CartProvider>,
    document.getElementById('root')
);
