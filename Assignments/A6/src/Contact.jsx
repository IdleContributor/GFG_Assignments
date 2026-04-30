import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    
    // Simulate form submission
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
    
    // Reset success message after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-header__title">Get in Touch</h1>
        <p className="page-header__subtitle">
          Have questions about React Router? Send us a message!
        </p>
      </div>

      <div className="contact-wrapper">
        <div className="contact-info">
          <h2>Contact Information</h2>
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-item__icon">&#128231;</span>
              <div>
                <h3>Email</h3>
                <p>simarjot4888@gmail.com</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-item__icon">&#128222;</span>
              <div>
                <h3>Phone</h3>
                <p>+91 84475 02981</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-item__icon">&#127968;</span>
              <div>
                <h3>Address</h3>
                <p>New Delhi, 110031<br />Delhi, India</p>
              </div>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send a Message</h2>
          
          {submitted && (
            <div className="success-message">
              ✅ Message sent successfully! We'll get back to you soon.
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us about your React Router experience..."
              required
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary">
              Send Message
            </button>
            <Link to="/" className="btn btn--outline">
              Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;