import React from 'react';

const CartModal = ({ cart, incrementItem, decrementItem, onClose }) => {
    return (
        <div className="cart-modal">
            <button onClick={onClose}>Close</button>
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                cart.map((item) => (
                    <div key={item.id} className="cart-item">
                        <img src={item.image} alt={item.name} className="cart-item-image" />
                        <div className="cart-item-details">
                            <h4>{item.name}</h4>
                            <p>${item.price.toFixed(2)}</p>
                            <div className="cart-item-controls">
                                <button onClick={() => decrementItem(item.id)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => incrementItem(item.id)}>+</button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default CartModal;
