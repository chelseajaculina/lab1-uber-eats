import React, { useState } from 'react';
import './RestaurantMenu.css'; // Import CSS for styling
import NavBarBusiness from './NavBarBusiness';
import axios from 'axios'; // Import axios to handle HTTP requests

const RestaurantMenu = () => {
  const [showModal, setShowModal] = useState(false); // Control modal visibility
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

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSuccessMessage('');
    setErrorMessage('');
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

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
      // Make POST request to Django backend
      const response = await axios.post('http://localhost:8000/api/dishes/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Dish added successfully!');
      setErrorMessage('');
      handleCloseModal(); // Close modal after success
    } catch (err) {
      setErrorMessage('Failed to add dish. Please try again.');
    }
  };

  return (
    <div className="restaurant-menu">
      {/* Header with Uber Eats logo and logout button */}
      <NavBarBusiness />

      <h2 className="menu-title">Menu</h2>

      {/* Add Dish Button */}
      <div className="add-dish-section">
        <button className="add-dish-button" onClick={handleOpenModal}>
          Add a new dish
        </button>
      </div>

      {/* Modal for Adding New Dish */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add a New Dish</h2>
            <form className="dish-form" onSubmit={handleSubmit}>
              <div>
                <label>Name:</label>
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
                <label>Select category:</label>
                <select name="category" value={dishData.category} onChange={handleChange}>
                  <option value="Appetizer">Appetizer</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>

              <div>
                <label>Select type:</label>
                <select name="type" value={dishData.type} onChange={handleChange}>
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                </select>
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
                <label>Description:</label>
                <textarea
                  name="description"
                  value={dishData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                ></textarea>
              </div>

              <div>
                <label>Add dish image:</label>
                <input type="file" name="image" onChange={handleImageChange} />
              </div>

              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
              {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

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
