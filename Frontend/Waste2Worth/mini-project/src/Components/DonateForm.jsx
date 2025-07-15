import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./donateform.css";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// Component to capture map click and update coordinates
const LocationPicker = ({ setCoords }) => {
  useMapEvents({
    click(e) {
      setCoords([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

// Component to programmatically center the map
const CenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 13);
  }, [coords, map]);
  return null;
};

const DonateForm = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [coords, setCoords] = useState([19.1667, 74.0333]); // Default: Phaltan
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    foodType: "",
    quantity: "",
    address: "",
    foodDetails: "",
  });

  // Fetch current user location when component mounts
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords([latitude, longitude]);
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
        }
      );
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("customerEmail", form.email);
    formData.append("foodType", form.foodType);
    formData.append("quantity", form.quantity);
    formData.append("address", form.address);
    formData.append("foodDetails", form.foodDetails);
    formData.append("latitude", coords[0]);
    formData.append("longitude", coords[1]);
    formData.append("donationDate", new Date().toISOString()); // System date
    if (image) formData.append("image", image);

    try {
      await axios.post("http://localhost:8080/api/donations/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

      setForm({
        name: "",
        email: "",
        foodType: "",
        quantity: "",
        address: "",
        foodDetails: "",
      });
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error submitting donation:", error);
    }
  };

  return (
    <div className="donation-form">
      <h2>Donate Food</h2>
      <div className="form-container">
        <div className="form-column">
          <form id="donateForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input type="text" name="name" value={form.name} required onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Your Email</label>
              <input type="email" name="email" value={form.email} required onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Food Type</label>
              <select name="foodType" value={form.foodType} required onChange={handleChange}>
                <option value="">--Select--</option>
                <option value="Veg">Veg</option>
                <option value="Non-veg">Non-veg</option>
                <option value="Mixed">Mixed</option>
                <option value="Rotten">Rotten</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quantity (person)</label>
              <input type="number" name="quantity" value={form.quantity} required onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Location Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                required
                placeholder="Enter your location address"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Food Details</label>
              <textarea
                name="foodDetails"
                rows="2"
                value={form.foodDetails}
                placeholder="Describe the food..."
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label>Upload Food Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            <button className="button1" type="submit">Submit Donation</button>
          </form>
        </div>

        <div className="form-column">
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Food Preview" />
            </div>
          )}

          <div className="form-group" style={{ marginTop: "20px" }}>
            <label>Click on Map to Change Location</label>
            <div
              style={{
                height: "250px",
                width: "100%",
                maxWidth: "400px",
                border: "2px solid #ccc",
                borderRadius: "10px",
                overflow: "hidden",
                margin: "0 auto",
              }}
            >
              <MapContainer center={coords} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <CenterMap coords={coords} />
                <LocationPicker setCoords={setCoords} />
                <Marker position={coords} />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      {showSuccessMessage && (
        <div className="success-message">Your donation was submitted successfully!</div>
      )}
    </div>
  );
};

export default DonateForm;
