import React from 'react';
import "./contact.css";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    alert("Thank you for reaching out to us. We will contact you soon.");
    e.target.reset(); // Optionally reset the form fields
  };

  return (
    <div id='contact-body'>
      <header>
        <h1>Contact Us</h1>
        <p>We’re Here to Help</p>
      </header>

      <section className="contact-container">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>Have questions or want to get involved? Reach out to us!</p>

          <div className="info-box">
            <h3>📍 Address</h3>
            <p>123 Hope Street, Foodville, CA 90210</p>
          </div>

          <div className="info-box">
            <h3>📞 Phone</h3>
            <p>(123) 456-7890</p>
          </div>

          <div className="info-box">
            <h3>📧 Email</h3>
            <p>contact@hopefoodbank.org</p>
          </div>

          <div className="info-box">
            <h3>⏰ Working Hours</h3>
            <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
            <p>Sat - Sun: 10:00 AM - 4:00 PM</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
