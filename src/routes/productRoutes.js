import express from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProduct,
    updateProduct,
} from "./../controllers/productController.js";
import { resizeImages, uploadImage } from "../middlewares/uploadImage.js";

const router = express.Router();

// Routes for fetching all products and creating a new product
router.route("/")
    .get(getAllProducts)  // Get all products
    .post(uploadImage, resizeImages, createProduct); // Create a new product

// Routes for a specific product (by ID): get, delete, update
router.route("/:id")
    .get(getProduct)       // Get a product by ID
    .delete(deleteProduct) // Delete a product by ID
    .patch(uploadImage, resizeImages, updateProduct); // Update a product by ID

export default router;

