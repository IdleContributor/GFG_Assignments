import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";

const productsRouter = express.Router();

// GET    /api/products          → get all (supports ?category= and ?inStock= filters)
// POST   /api/products          → create new product
productsRouter.route("/")
  .get(getAllProducts)
  .post(createProduct);

// GET    /api/products/:id      → get one by id
// PUT    /api/products/:id      → update by id
// DELETE /api/products/:id      → delete by id
productsRouter.route("/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

export default productsRouter;
