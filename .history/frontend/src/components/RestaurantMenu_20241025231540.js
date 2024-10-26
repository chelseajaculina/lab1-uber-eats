import React, { useState, useEffect } from 'react';
import './RestaurantMenu.css'; // Import CSS for styling
import NavBarBusiness from './NavBarBusiness';
import axios from 'axios'; // Import axios to handle HTTP requests

const RestaurantMenu = () => {
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [dishes, setDishes] = useState([]); // State to hold the list of dishes
  const [editingDishId, setEditingDishId] = useState(null); // Track which dish is being edited
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

  // Fetch dishes on component mount
  useEffect(() => {
    fetchDishes();
  }, []);

  // Function to fetch dishes from the backend
  const fetchDishes = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/restaurants/dishes/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDishes(response.data); // Set fetched dishes to state
    } catch (err) {
      console.error('Error fetching dishes:', err);
    }
  };

  // Open modal for adding or editing a dish
  const handleOpenModal = (dish = null) => {
    if (dish) {
      // If editing, populate form with dish data
      setEditingDishId(dish.id);  // Track which dish is being edited
      setDishData({
        name: dish.name,
        price: dish.price,
        category: dish.category,
        type: dish.type,
        ingredients: dish.ingredients,
        description: dish.description,
        image: dish.image,
      });
    } else {
      // If adding a new dish, reset form
      setEditingDishId(null); // Not editing, it's a new dish
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
    setShowModal(true); // Show the modal
  };

  // Close modal and reset form states
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

  // Handle form input changes
  const handleChange = (e) => {
    setDishData({
      ...dishData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image change
  const handleImageChange = (e) => {
    setDishData({
      ...dishData,
      image: e.target.files[0], // Set the image file
    });
  };

  // Handle form submission for adding or editing a dish
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state

    // Create FormData to send the image and other form data
    const formData = new FormData();
    formData.append('name', dishData.name);
    formData.append('price', dishData.price);
    formData.append('category', dishData.category);
    formData.append('type', dishData.type);
    formData.append('ingredients', dishData.ingredients);
    formData.append('description', dishData.description);
    if (dishData.image) {
      formData.append('image', dishData.image);
    }

    try {
      const token = localStorage.getItem('access_token');

      if (editingDishId) {
        // Update an existing dish with PUT request
        await axios.put(`http://localhost:8000/api/restaurants/dishes/${editingDishId}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccessMessage('Dish updated successfully!');
      } else {
        // Add a new dish with POST request
        await axios.post('http://localhost:8000/api/restaurants/dishes/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccessMessage('Dish added successfully!');
      }

      handleCloseModal(); // Close modal after success
      fetchDishes(); // Re-fetch dishes to display the newly added or updated dish
    } catch (err) {
      setErrorMessage('Failed to save dish. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="restaurant-menu">
      <NavBarBusiness />

      <h2 className="menu-title">Featured Items</h2>

      {/* Display dishes with Edit button */}
      <div className="dishes-list featured-items">
        {dishes.length > 0 ? (
          dishes.map((dish, index) => (
            <div key={dish.id} className="dish-card">
              {/* Display "most liked" label if available */}
              {index < 3 && (
                <div className="most-liked-badge">
                  #{index + 1} most liked
                </div>
              )}
              <img
                src={`http://localhost:8000${dish.image}`}
                alt={dish.name}
                className="dish-image"
              />
              <h3>{dish.name}</h3>
              <p><strong>Price:</strong> ${dish.price}</p>
              <button className="add-to-cart-button">
                <span className="plus-icon">+</span>
              </button>
            </div>
          ))
        ) : (
          <p>No dishes available</p>
        )}
      </div>

      {/* Modal for Adding/Editing Dish */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingDishId ? 'Update Dish Information' : 'Add a New Dish'}</h2>
            <form className="dish-form" onSubmit={handleSubmit}>
              {/* Form fields */}
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

              {/* Display messages */}
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
