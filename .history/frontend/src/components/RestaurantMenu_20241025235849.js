import React, { useState, useEffect } from 'react';
import './RestaurantMenu.css';
import NavBarBusiness from './NavBarBusiness';
import axios from 'axios';

const RestaurantMenu = () => {
  const [showModal, setShowModal] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [editingDishId, setEditingDishId] = useState(null);
  const [dishData, setDishData] = useState({
    name: '',
    price: '',
    category: 'Appetizer',
    type: 'Veg',
    ingredients: '',
    description: '',
    image: null,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/restaurants/dishes/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDishes(response.data);
    } catch (err) {
      console.error('Error fetching dishes:', err);
    }
  };

  const handleOpenModal = (dish = null) => {
    if (dish) {
      setEditingDishId(dish.id);
      setDishData({
        name: dish.name,
        price: dish.price,
        category: dish.category,
        type: dish.type,
        ingredients: dish.ingredients,
        description: dish.description,
        image: null, // Reset image field to avoid using a URL
      });
    } else {
      setEditingDishId(null);
      setDishData({
        name: '',
        price: '',
        category: 'Appetizer',
        type: 'Veg',
        ingredients: '',
        description: '',
        image: null,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSuccessMessage('');
    setErrorMessage('');
    setDishData({
      name: '',
      price: '',
      category: 'Appetizer',
      type: 'Veg',
      ingredients: '',
      description: '',
      image: null,
    });
  };

  const handleChange = (e) => {
    setDishData({
      ...dishData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setDishData({
      ...dishData,
      image: e.target.files[0], // Set the image file if a new one is chosen
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', dishData.name);
    formData.append('price', dishData.price);
    formData.append('category', dishData.category);
    formData.append('type', dishData.type);
    formData.append('ingredients', dishData.ingredients);
    formData.append('description', dishData.description);

    // Only append the image if a new one is selected
    if (dishData.image) {
      formData.append('image', dishData.image);
    }

    try {
      const token = localStorage.getItem('access_token');

      if (editingDishId) {
        await axios.put(`http://localhost:8000/api/restaurants/dishes/${editingDishId}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccessMessage('Dish updated successfully!');
      } else {
        await axios.post('http://localhost:8000/api/restaurants/dishes/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccessMessage('Dish added successfully!');
      }

      handleCloseModal();
      fetchDishes();
    } catch (err) {
      setErrorMessage('Failed to save dish. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="restaurant-menu">
      <NavBarBusiness />

      <h2 className="menu-title">Menu</h2>

      <div className="add-dish-section">
        <button className="add-dish-button" onClick={() => handleOpenModal()}>
          Add a new dish
        </button>
      </div>

      <div className="dishes-list">
        {dishes.length > 0 ? (
          dishes.map((dish) => (
            <div key={dish.id} className="dish-card">
              <img
                src={`http://localhost:8000${dish.image}`}
                alt={dish.name}
                className="dish-image"
              />
              <h3>{dish.name}</h3>
              <p>{dish.description}</p>
              <p><strong>Price:</strong> ${dish.price}</p>
              <button className="edit-button" onClick={() => handleOpenModal(dish)}>
                Edit
              </button>
            </div>
          ))
        ) : (
          <p>No dishes available</p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingDishId ? 'Update Dish Information' : 'Add a New Dish'}</h2>
            <form className="dish-form" onSubmit={handleSubmit}>
              <div>
                <label>Dish Name:</label>
                <input
                  type="text"
                  name="name"
                  value={dishData.name}
                  onChange={handleChange}
                  placeholder="Enter dish name"
                  required
                />
              </div>

              <div>
                <label>Ingredients:</label>
                <input
                  type="text"
                  name="ingredients"
                  value={dishData.ingredients}
                  onChange={handleChange}
                  placeholder="Enter ingredients"
                  required
                />
              </div>

              <div>
                <label>Add dish image:</label>
                <input type="file" name="image" onChange={handleImageChange} />
              </div>

              <div>
                <label>Price:</label>
                <div className="price-input">
                  <span>$</span>
                  <input
                    type="number"
                    name="price"
                    value={dishData.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    required
                  />
                </div>
              </div>

              <div>
                <label>Description:</label>
                <textarea
                  name="description"
                  value={dishData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                ></textarea>
              </div>

              <div>
                <label>Select category:</label>
                <select name="category" value={dishData.category} onChange={handleChange}>
                  <option value="Appetizer">Appetizer</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>

              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
              {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

              {isLoading && <p>Loading...</p>}

              <div className="form-buttons">
                <button type="submit" className="save-button">
                  Save Changes
                </button>
                <button type="button" className="cancel-button" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
