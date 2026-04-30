import React from "react";
import { useState } from "react";

/*
  ADDPRODUCT COMPONENT
  ====================
  Controlled form to add a new product to the list.
  Manages its own local form state, then calls onAdd (from App)
  to push the new product up to the shared state.

  PROPS:
  - onAdd : function(newProduct) — lifts the new product up to App

  LOCAL STATE:
  - form : { name, price, category, quantity }
*/

const AddProduct = ({ onAdd }) => {
  // Local state for the controlled form fields
  const [form, setForm] = useState({
    name:     "",
    price:    "",
    category: "Electronics",
    quantity: "",
  });

  // Generic change handler — works for all input types
  // Uses computed property name [e.target.name] to update the right field
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price) return; // basic validation

    const qty = form.quantity === "" ? null : Number(form.quantity);

    // Build the new product object and pass it up to App
    // inStock is derived: true when quantity is null (unspecified) or > 0
    const newProduct = {
      id:       Date.now(),
      name:     form.name.trim(),
      price:    Number(form.price),
      category: form.category,
      quantity: qty,
      inStock:  qty === null || qty > 0,
    };

    onAdd(newProduct);

    // Reset form after adding
    setForm({ name: "", price: "", category: "Electronics", quantity: "" });
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h2 className="add-form__title">Add New Product</h2>

      <div className="add-form__row">

        {/* Product name */}
        <div className="add-form__group">
          <label className="add-form__label" htmlFor="name">Product Name</label>
          <input
            className="add-form__input"
            type="text"
            id="name"
            name="name"
            placeholder="e.g. Wireless Speaker"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Price */}
        <div className="add-form__group">
          <label className="add-form__label" htmlFor="price">Price (₹)</label>
          <input
            className="add-form__input"
            type="number"
            id="price"
            name="price"
            placeholder="e.g. 1499"
            value={form.price}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        {/* Stock Quantity */}
        <div className="add-form__group">
          <label className="add-form__label" htmlFor="quantity">Quantity</label>
          <input
            className="add-form__input"
            type="number"
            id="quantity"
            name="quantity"
            placeholder="e.g. 50"
            value={form.quantity}
            onChange={handleChange}
            min="0"
          />
        </div>

        {/* Category */}
        <div className="add-form__group">
          <label className="add-form__label" htmlFor="category">Category</label>
          <select
            className="add-form__input add-form__select"
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option>Electronics</option>
            <option>Home</option>
            <option>Clothing</option>
            <option>Books</option>
            <option>Sports</option>
          </select>
        </div>

      </div>

      {/* Submit button */}
      <div className="add-form__footer">
        <button className="add-form__btn" type="submit">
          + Add Product
        </button>
      </div>
    </form>
  );
};

export default AddProduct;
