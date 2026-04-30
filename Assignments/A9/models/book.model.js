import mongoose from "mongoose";

/**
 * Book Schema
 * ===========
 * Demonstrates Mongoose schema features:
 * - Field types and validation
 * - required, unique, minlength, maxlength, enum
 * - Custom error messages
 * - Default values
 * - Timestamps (createdAt, updatedAt)
 *
 * Same pattern as project/backend/models/user.model.js
 */

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title must be at least 1 character"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      minlength: [2, "Author name must be at least 2 characters"],
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      trim: true,
      match: [/^[0-9-]+$/, "ISBN must contain only numbers and hyphens"],
    },
    publishedYear: {
      type: Number,
      required: [true, "Published year is required"],
      min: [1000, "Published year must be at least 1000"],
      max: [new Date().getFullYear(), "Published year cannot be in the future"],
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      enum: {
        values: ["Fiction", "Non-Fiction", "Science", "History", "Biography", "Fantasy", "Mystery", "Romance", "Other"],
        message: "{VALUE} is not a valid genre",
      },
    },
    pages: {
      type: Number,
      required: [true, "Number of pages is required"],
      min: [1, "Pages must be at least 1"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
