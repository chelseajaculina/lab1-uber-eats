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

    if (cart.length === 0) return <div>Your cart is empty.</div>;

    return (
        <div className="view-cart">
            <h2>View Cart</h2>
            <div className="cart-items">
                {cart.map(item => (
                    <div key={item.id} className="cart-item">
                        <h4>{item.name}</h4>
                        <p>Price: ${item.price.toFixed(2)}</p>
                        <p>Quantity: 
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            />
                        </p>
                        <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
                    </div>
                ))}
            </div>
            <h3>Total: ${getTotal()}</h3>
            <button className="checkout-button">Checkout</button>
        </div>
    );
};

export default ViewCart;
