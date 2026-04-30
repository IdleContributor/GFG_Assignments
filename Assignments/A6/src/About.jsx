import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-header__title">About This Project</h1>
        <p className="page-header__subtitle">
          Assignment 6: React Routing — Building multi-page applications
        </p>
      </div>

      <div className="content">
        <div className="content__section">
          <h2>What is React Router?</h2>
          <p>
            React Router is a library that enables client-side routing in React applications.
            Instead of loading new HTML pages from the server, it dynamically renders different
            components based on the current URL, creating a smooth single-page application experience.
          </p>
        </div>

        <div className="content__section">
          <h2>Key Concepts</h2>
          <ul className="content__list">
            <li><strong>BrowserRouter:</strong> Wraps the app to enable routing functionality</li>
            <li><strong>Routes & Route:</strong> Define which component renders for each URL path</li>
            <li><strong>Link:</strong> Navigate between pages without page refresh</li>
            <li><strong>useLocation:</strong> Hook to access current route information</li>
            <li><strong>Catch-all routes:</strong> Handle 404 errors with path="*"</li>
          </ul>
        </div>

        <div className="content__section">
          <h2>Benefits</h2>
          <div className="benefits-grid">
            <div className="benefit">
              <h3>⚡ Performance</h3>
              <p>No page reloads mean faster navigation and better user experience.</p>
            </div>
            <div className="benefit">
              <h3>🔗 SEO Friendly</h3>
              <p>Each page has its own URL, making it shareable and bookmarkable.</p>
            </div>
            <div className="benefit">
              <h3>📱 Mobile Optimized</h3>
              <p>Smooth transitions feel more like a native mobile app.</p>
            </div>
          </div>
        </div>

        <div className="content__actions">
          <Link to="/contact" className="btn btn--primary">
            Contact Us
          </Link>
          <Link to="/" className="btn btn--outline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;