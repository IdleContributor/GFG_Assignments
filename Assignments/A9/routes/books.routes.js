import express from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/books.controller.js";

const booksRouter = express.Router();

// GET    /api/books          → get all (supports ?genre= and ?inStock= filters)
// POST   /api/books          → create new book
booksRouter.route("/")
  .get(getAllBooks)
  .post(createBook);

// GET    /api/books/:id      → get one by id
// PUT    /api/books/:id      → update by id
// DELETE /api/books/:id      → delete by id
booksRouter.route("/:id")
  .get(getBookById)
  .put(updateBook)
  .delete(deleteBook);

export default booksRouter;
