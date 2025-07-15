import React, { useState } from "react";
import axios from "axios";
import "./store.css";

import organic from "../assets/organic-compost.jpg";
import liquid from "../assets/liquid-compost.jpg";
import bio from "../assets/bio-compost.jpeg";

const products = [
  {
    id: 1,
    name: "Organic Compost",
    description: "Made from 100% recycled food waste.",
    price: "₹199",
    image: organic,
  },
  {
    id: 2,
    name: "Liquid Compost Tea",
    description: "Nutrient-rich liquid fertilizer for home gardens.",
    price: "₹149",
    image: liquid,
  },
  {
    id: 3,
    name: "Biofertilizer Mix",
    description: "Enhanced with nitrogen-fixing microbes.",
    price: "₹249",
    image: bio,
  },
];

const Store = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    quantity: 1,
  });

  const handleBookClick = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedProduct(null);
    setFormData({ name: "", email: "", phone: "", address: "", quantity: 1 });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const unitPrice = parseInt(selectedProduct.price.replace("₹", ""));
    const totalPrice = formData.quantity * unitPrice;

    const bookingData = {
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      productName: selectedProduct.name,
      quantity: formData.quantity,
      totalPrice,
    };

    try {
      const response = await axios.post("http://localhost:8080/api/bookings", bookingData);
console.log("Booking successful:", response.data);

      setShowThankYou(true);
      closeForm();
      setTimeout(() => setShowThankYou(false), 3000);
    } catch (error) {
      console.error("Booking failed:", error.response ? error.response.data : error.message);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div id="store-main">
      <div className="store-container">
        <h1 className="store-title">🌿 Organic Fertilizer Store</h1>
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <img src={product.image} alt={product.name} className="product-image" />
              <h2 className="product-name">{product.name}</h2>
              <p className="product-description">{product.description}</p>
              <p className="product-price">{product.price}</p>
              <button className="buy-button" onClick={() => handleBookClick(product)}>
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="booking-form">
            <button className="close-btn" onClick={closeForm}>×</button>
            <h2>Booking for: {selectedProduct.name}</h2>
            <form className="BookingForm" onSubmit={handleFormSubmit}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                required
              />

              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />

              <button type="submit">Confirm Booking</button>
            </form>
          </div>
        </div>
      )}

      {showThankYou && (
        <div className="thank-you-dialog">
          <div className="thank-you-box">
            <h2>🎉 Thank You!</h2>
            <p>Thank you for supporting us. Check your email for details.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
