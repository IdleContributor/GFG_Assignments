import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import AddProduct from "./AddProduct";

/*
  APP COMPONENT
  =============
  Root component. Owns the products state so it can be
  shared down to both AddProduct (to add) and ProductCard (to remove).

  STATE:
  - products: array of product objects
    { id, name, price, category, inStock }

  CONCEPTS PRACTICED:
  - useState hook to manage a list
  - useEffect hook to sync state with localStorage
  - Passing state down as props
  - Passing setter functions down as props (state lifting)
  - Conditional rendering for empty list
  - .filter() to remove an item by id
*/

// Initial seed data — only used on the very first load
// (when localStorage has no saved products yet)
const initialProducts = [
  { id: 1, name: "Mechanical Keyboard",     price: 2499, category: "Electronics", inStock: true  },
  { id: 2, name: "Noise-Cancel Headphones", price: 3999, category: "Electronics", inStock: true  },
  { id: 3, name: "Ergonomic Mouse",         price: 1299, category: "Electronics", inStock: false },
  { id: 4, name: "Desk Lamp",               price:  799, category: "Home",        inStock: true  },
];

// Read persisted products from localStorage on first render.
// Falls back to initialProducts if nothing is saved yet.
const getStoredProducts = () => {
  try {
    const stored = localStorage.getItem("a5_products");
    return stored ? JSON.parse(stored) : initialProducts;
  } catch {
    return initialProducts;
  }
};

const App = () => {
  // Lazy initialiser — getStoredProducts runs once on mount, not on every render
  const [products, setProducts] = useState(getStoredProducts);

  // Persist to localStorage whenever the products list changes
  useEffect(() => {
    localStorage.setItem("a5_products", JSON.stringify(products));
  }, [products]);

  // Add a new product — called from AddProduct component
  const handleAdd = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  // Remove a product by id — called from ProductCard component
  const handleRemove = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="app">

      {/* ===== HEADER ===== */}
      <header className="app__header">
        <h1 className="app__title">&#128722; Product List</h1>
        <p className="app__subtitle">
          React components · props · useState · conditional rendering
        </p>
      </header>

      <main className="app__main">

        {/* ===== ADD PRODUCT FORM ===== */}
        {/* handleAdd is passed as a prop so AddProduct can update state */}
        <AddProduct onAdd={handleAdd} />

        {/* ===== PRODUCT COUNT ===== */}
        <p className="app__count">
          {products.length} product{products.length !== 1 ? "s" : ""} in list
        </p>

        {/* ===== CONDITIONAL RENDERING =====
            If the products array is empty, show an empty state message.
            Otherwise map over the array and render a ProductCard for each. */}
        {products.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon">&#128230;</span>
            <p className="empty-state__text">No products yet. Add one above!</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              // Each ProductCard receives its data via props
              // onRemove lets the card tell App to delete it
              <ProductCard
                key={product.id}
                product={product}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}

      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer__inner">
          <span className="footer__logo">SIMARJOT SINGH</span>
          <p className="footer__copy">Built to fulfill GeeksforGeeks Assignment-5 Requirements</p>
        </div>
      </footer>

    </div>
  );
};

export default App;
