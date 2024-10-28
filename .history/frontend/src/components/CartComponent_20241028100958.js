import React, { useContext } from 'react';
import { CartContext } from './CartContext';

const CartComponent = () => {
    const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id}>
                            <img src={item.image} alt={item.name} width="50" />
                            <div>
                                <h4>{item.name}</h4>
                                <p>Price: ${item.price}</p>
                                <p>Quantity: {item.quantity}</p>
                                <button onClick={() => removeFromCart(item.id)}>Remove</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <h3>Total: ${calculateTotal()}</h3>
            <button onClick={clearCart}>Clear Cart</button>
        </div>
    );
};

export default CartComponent;
