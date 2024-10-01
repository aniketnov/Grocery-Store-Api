import express from "express";
import { createCategory, deleteCategory, getAllCategories, getCategory, updateCategory, } from "../controllers/categoriesController.js";
import { setCategory } from "../controllers/categoriesController.js";
import { createSubcategory } from "../controllers/subcategoriesController.js";

import { uploadImage, uploadResizeImage } from "../middlewares/uploadImage.js";





const router = express.Router();

router
    .route('/:id/subcategories')
    .post(uploadImage, uploadResizeImage, setCategory, createSubcategory);

// Routes for fetching all categories and creating a new category
router.route("/")
    .get(getAllCategories)  // Get all categories
    .post(uploadImage, uploadResizeImage, createCategory);   // Create a new category

// Routes for a specific category (by ID): get, delete, update
router.route("/:id")
    .get(getCategory)       // Get a category by ID
    .delete(deleteCategory) // Delete a category by ID
    .patch(uploadImage, uploadResizeImage, updateCategory); // Update a category by ID



export default router;
