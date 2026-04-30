import React from "react";
import Nav from "./Nav";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import NotFound from "./NotFound";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div className="app">
      {/* Navigation appears on every page */}
      <Nav />

      {/* Routes define which component renders for each URL */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* Catch-all route for 404 - must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Footer appears on every page */}
      <footer className="footer">
        <div className="footer__inner">
          <span className="footer__logo">SIMARJOT SINGH</span>
          <p className="footer__copy">Built to fulfill GeeksforGeeks Assignment-6 Requirements</p>
        </div>
      </footer>
    </div>
  );
};

export default App;