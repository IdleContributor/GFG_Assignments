import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="page">
      <div className="hero">
        <h1 className="hero__title">
          Welcome to React Routing
        </h1>
        <p className="hero__subtitle">
          Navigate between pages without page refresh using React Router DOM.
          This demonstrates client-side routing in a single-page application.
        </p>
        <div className="hero__actions">
          <Link to="/about" className="btn btn--primary">
            Learn More
          </Link>
          <Link to="/contact" className="btn btn--outline">
            Get in Touch
          </Link>
        </div>
      </div>

      <div className="features">
        <h2 className="features__title">Features Demonstrated</h2>
        <div className="features__grid">
          <div className="feature-card">
            <span className="feature-card__icon">&#128640;</span>
            <h3>Fast Navigation</h3>
            <p>Client-side routing means no page reloads — instant navigation between pages.</p>
          </div>
          <div className="feature-card">
            <span className="feature-card__icon">&#128279;</span>
            <h3>URL Management</h3>
            <p>Each page has its own URL that you can bookmark, share, or navigate to directly.</p>
          </div>
          <div className="feature-card">
            <span className="feature-card__icon">&#10060;</span>
            <h3>404 Handling</h3>
            <p>Try visiting a non-existent URL like <code>/invalid</code> to see the custom 404 page.</p>
            <Link to="/invalid" className="btn btn--outline">
              See 404 Page →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;