import React from 'react';
import './ViewCart.css';

const ViewCart = ({ cart, setCart }) => {
    const handleRemoveItem = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const handleQuantityChange = (id, newQuantity) => {
        setCart(cart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    };

    const getTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    if (cart.length === 0) {
        return <div className="cart-container cart-empty">Your cart is empty.</div>;
    }

    return (
        <div className="cart-container">
            <div className="cart-header">Your Cart</div>
            <div className="cart-items">
                {cart.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="cart-item-details">
                            <img src={item.image} alt={item.name} />
                            <div>
                                <h4>{item.name}</h4>
                                <p>${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="cart-item-quantity">
                            <span>Qty:</span>
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            />
                            <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-total">Total: ${getTotal()}</div>
            <button className="checkout-button">Checkout</button>
        </div>
    );
};

export default ViewCart;
