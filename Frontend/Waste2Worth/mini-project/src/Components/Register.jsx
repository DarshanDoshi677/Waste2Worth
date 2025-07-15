import React, { useState } from 'react';
import axios from 'axios';
import "./register.css";

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'User',
    status: 'APPROVED', // Default for User
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prevForm => {
      const updatedForm = { ...prevForm, [id]: value };
      // Update status based on role selection
      if (id === 'role') {
        updatedForm.status = value === 'NGO' ? 'PENDING' : 'APPROVED';
      }
      return updatedForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', form);
      setMessage(res.data);
    } catch (err) {
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div id="register-main-body">
      <div className="register-container">
        <div className="register-card">
          <h2>Food Bank Registration</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" onChange={handleChange} required />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" onChange={handleChange} required />

            <label htmlFor="phone">Phone</label>
            <input type="tel" id="phone" onChange={handleChange} required />

            <label htmlFor="role">Register as</label>
            <select id="role" onChange={handleChange} required>
              <option value="User">User</option>
              <option value="NGO">NGO</option>
            </select>

            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={handleChange} required />

            <button type="submit" className="register-btn">Register</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Register;
