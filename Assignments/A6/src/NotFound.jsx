import React from "react";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="page">
      <div className="not-found">
        <div className="not-found__icon">&#128533;</div>
        <h1 className="not-found__title">404 - Page Not Found</h1>
        <p className="not-found__message">
          Sorry, the page <code>{location.pathname}</code> doesn't exist.
          It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="not-found__suggestions">
          <h2>What you can do:</h2>
          <ul>
            <li>Check the URL for typos</li>
            <li>Go back to the previous page</li>
            <li>Visit our homepage</li>
            <li>Use the navigation menu above</li>
          </ul>
        </div>

        <div className="not-found__actions">
          <Link to="/" className="btn btn--primary">
            &#127968; Go Home
          </Link>
          <button 
            className="btn btn--outline" 
            onClick={() => window.history.back()}
          >
            &#8592; Go Back
          </button>
        </div>

        <div className="not-found__help">
          <p>
            Still having trouble? Try visiting our{" "}
            <Link to="/about" className="link">About page</Link> or{" "}
            <Link to="/contact" className="link">Contact us</Link> for help.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;