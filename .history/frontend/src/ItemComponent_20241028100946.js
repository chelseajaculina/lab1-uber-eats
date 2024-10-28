import React, { useContext } from 'react';
import { CartContext } from './CartContext';

const ItemComponent = ({ item }) => {
    const { addToCart } = useContext(CartContext);

    return (
        <div className="item">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>Price: ${item.price}</p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
        </div>
    );
};

export default ItemComponent;
