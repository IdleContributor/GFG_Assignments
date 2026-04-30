/**
 * Books Controller
 * ================
 * MongoDB CRUD operations using Mongoose.
 * All handlers wrapped in asyncHandler so errors bubble to errorMiddleware.
 *
 * ROUTES HANDLED:
 * GET    /api/books          → getAllBooks
 * GET    /api/books/:id      → getBookById
 * POST   /api/books          → createBook
 * PUT    /api/books/:id      → updateBook
 * DELETE /api/books/:id      → deleteBook
 */

import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/errorHandler.utils.js";
import Book from "../models/book.model.js";

// ==========================================
// GET ALL BOOKS
// GET /api/books
// Supports optional ?genre= and ?inStock= query filters
// ==========================================
export const getAllBooks = asyncHandler(async (req, res) => {
  const { genre, inStock } = req.query;

  // Build filter object dynamically
  const filter = {};
  if (genre) filter.genre = genre;
  if (inStock !== undefined) filter.inStock = inStock === "true";

  const books = await Book.find(filter).sort({ createdAt: -1 }); // newest first

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
});

// ==========================================
// GET BOOK BY ID
// GET /api/books/:id
// ==========================================
export const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new ApiError(404, `Book with id ${req.params.id} not found`);
  }

  res.status(200).json({
    success: true,
    data: book,
  });
});

// ==========================================
// CREATE BOOK
// POST /api/books
// Body: { title, author, isbn, publishedYear, genre, pages, price, inStock?, description? }
// Mongoose validation runs automatically
// ==========================================
export const createBook = asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);

  res.status(201).json({
    success: true,
    message: "Book created successfully",
    data: book,
  });
});

// ==========================================
// UPDATE BOOK
// PUT /api/books/:id
// Body: any subset of book fields
// { new: true } returns the updated document
// { runValidators: true } runs schema validation on update
// ==========================================
export const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!book) {
    throw new ApiError(404, `Book with id ${req.params.id} not found`);
  }

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    data: book,
  });
});

// ==========================================
// DELETE BOOK
// DELETE /api/books/:id
// ==========================================
export const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) {
    throw new ApiError(404, `Book with id ${req.params.id} not found`);
  }

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
    data: book,
  });
});
