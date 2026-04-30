/**
 * Products Controller
 * ====================
 * In-memory CRUD for products — no database needed for this assignment.
 * Each handler is wrapped in asyncHandler so errors bubble to errorMiddleware.
 *
 * ROUTES HANDLED:
 * GET    /api/products          → getAllProducts
 * GET    /api/products/:id      → getProductById
 * POST   /api/products          → createProduct
 * PUT    /api/products/:id      → updateProduct
 * DELETE /api/products/:id      → deleteProduct
 */

import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/errorHandler.utils.js";

// ==========================================
// IN-MEMORY DATA STORE
// Acts as our "database" for this assignment.
// ==========================================
let products = [
  { id: 1, name: "Mechanical Keyboard", price: 2499, category: "Electronics", inStock: true  },
  { id: 2, name: "Noise-Cancel Headphones", price: 3999, category: "Electronics", inStock: true  },
  { id: 3, name: "Ergonomic Mouse",      price: 1299, category: "Electronics", inStock: false },
  { id: 4, name: "Desk Lamp",            price:  799, category: "Home",        inStock: true  },
];

// Auto-increment id counter
let nextId = products.length + 1;

// ==========================================
// GET ALL PRODUCTS
// GET /api/products
// Supports optional ?category= and ?inStock= query filters
// ==========================================
export const getAllProducts = asyncHandler(async (req, res) => {
  const { category, inStock } = req.query;

  let result = [...products];

  if (category) {
    result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (inStock !== undefined) {
    result = result.filter((p) => p.inStock === (inStock === "true"));
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result,
  });
});

// ==========================================
// GET PRODUCT BY ID
// GET /api/products/:id
// ==========================================
export const getProductById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    throw new ApiError(404, `Product with id ${id} not found`);
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// ==========================================
// CREATE PRODUCT
// POST /api/products
// Body: { name, price, category, inStock }
// ==========================================
export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, category, inStock } = req.body;

  if (!name || price === undefined || !category) {
    throw new ApiError(400, "name, price, and category are required");
  }

  const newProduct = {
    id:       nextId++,
    name:     name.trim(),
    price:    Number(price),
    category: category.trim(),
    inStock:  inStock ?? true,
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: newProduct,
  });
});

// ==========================================
// UPDATE PRODUCT
// PUT /api/products/:id
// Body: any subset of { name, price, category, inStock }
// ==========================================
export const updateProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new ApiError(404, `Product with id ${id} not found`);
  }

  // Merge existing product with the incoming fields
  products[index] = { ...products[index], ...req.body, id };

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: products[index],
  });
});

// ==========================================
// DELETE PRODUCT
// DELETE /api/products/:id
// ==========================================
export const deleteProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new ApiError(404, `Product with id ${id} not found`);
  }

  const deleted = products.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data: deleted,
  });
});
