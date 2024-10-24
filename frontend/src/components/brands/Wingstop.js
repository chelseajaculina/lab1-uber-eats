// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './BrandPage.css';

// const Wingstop = () => {
//     const [menuItems, setMenuItems] = useState([]);

//     useEffect(() => {
//         const fetchMenuItems = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8000/api/menu/wingstop/');
//                 setMenuItems(response.data);
//             } catch (error) {
//                 console.error('Error fetching menu items:', error);
//             }
//         };
//         fetchMenuItems();
//     }, []);

//     return (
//         <div className="brand-page-container">
//             <h1>Wingstop</h1>
//             <div className="menu-items">
//                 {menuItems.map((item) => (
//                     <div key={item.id} className="menu-item">
//                         <img src={item.image} alt={item.name} />
//                         <h3>{item.name}</h3>
//                         <p>${item.price}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Wingstop;
import React from 'react';
const Wingstop = () => {
  return (
    <div>
      <h1>Wingstop</h1>
      <p>Welcome to Wingstop! Here you can find information about the restaurant, menu, and more.</p>
      {/* Add any other details about Wingstop */}
    </div>
  );
};
export default Wingstop;