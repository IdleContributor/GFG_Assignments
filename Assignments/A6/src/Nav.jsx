import React from "react";
import { Link, useLocation } from "react-router-dom";

/*
  NAV COMPONENT
  =============
  Navigation bar with React Router Links.
  
  CONCEPTS PRACTICED:
  - Link component for client-side navigation (no page refresh)
  - useLocation hook to highlight the active page
  - Conditional CSS classes based on current route
*/

const Nav = () => {
  // useLocation gives us the current pathname
  const location = useLocation();

  return (
    <nav className="nav">
      <div className="nav__brand">
        <Link to="/" className="nav__logo">
          &#127968; MyApp
        </Link>
      </div>

      <ul className="nav__links">
        <li>
          <Link 
            to="/" 
            className={`nav__link ${location.pathname === "/" ? "nav__link--active" : ""}`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/about" 
            className={`nav__link ${location.pathname === "/about" ? "nav__link--active" : ""}`}
          >
            About
          </Link>
        </li>
        <li>
          <Link 
            to="/contact" 
            className={`nav__link ${location.pathname === "/contact" ? "nav__link--active" : ""}`}
          >
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;