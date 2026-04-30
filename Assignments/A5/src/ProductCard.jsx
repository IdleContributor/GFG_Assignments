import React from "react";

/*
  PRODUCTCARD COMPONENT
  =====================
  A reusable card that displays a single product's details.
  All data comes in via props — the component itself holds no state.

  PROPS:
  - product  : { id, name, price, category, inStock }
  - onRemove : function(id) — called when the Remove button is clicked
               This is the setter lifted up from App
*/

const ProductCard = ({ product, onRemove }) => {
  // Destructure the product object for cleaner JSX below
  const { id, name, price, category, inStock, quantity } = product;

  return (
    <div className="product-card">

      {/* Category badge */}
      <span className="product-card__badge">{category}</span>

      {/* Product name */}
      <h2 className="product-card__name">{name}</h2>

      {/* Price */}
      <p className="product-card__price">&#8377; {price.toLocaleString("en-IN")}</p>

      {/* Conditional rendering: show stock status */}
      <p className={`product-card__stock ${inStock ? "product-card__stock--in" : "product-card__stock--out"}`}>
        {inStock ? "✔ In Stock" : "✘ Out of Stock"}
      </p>

      {/* Quantity — only shown if a value was provided */}
      {quantity !== null && quantity !== undefined && (
        <p className="product-card__quantity">
          Qty: <strong>{quantity}</strong>
        </p>
      )}

      {/* Remove button — calls onRemove with this product's id */}
      <button
        className="product-card__btn"
        onClick={() => onRemove(id)}
      >
        Remove
      </button>

    </div>
  );
};

export default ProductCard;
