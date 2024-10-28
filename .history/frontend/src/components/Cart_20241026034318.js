// Cart.js
import React from 'react';

const Cart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cart.map(item => (
                        <li key={item.id}>
                            {item.name} - ${item.price.toFixed(2)} x {item.quantity}
                        </li>
                    ))}
                </ul>
            )}
            <p>Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</p>
        </div>
    );
};

export default Cart;
