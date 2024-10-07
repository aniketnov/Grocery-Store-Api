import express from "express";
import categoriesController from './../controllers/categoriesController.js';
import uploadmiddleware from "./../middlewares/uploadImage.js"
import subcategoryRouter from "./../routes/subcategoryRoutes.js"
import authController from "../controllers/authController.js";


const router = express.Router();


router.use('/:categoryId/sn', subcategoryRouter)


// Routes for fetching all categories and creating a new category
router.route("/")
    .get(categoriesController.getAllCategories)  // Get all categories
    .post(authController.protect, authController.restrictTo("admin"), uploadmiddleware.uploadImage, uploadmiddleware.uploadResizeImage, categoriesController.createCategory);   // Create a new category

// Routes for a specific category (by ID): get, delete, update
router.route("/:id")
    .get(categoriesController.getCategory)       // caGet a category by ID
    .delete(authController.protect, authController.restrictTo("admin"), categoriesController.deleteCategory) // Delete a category by ID
    .patch(authController.protect, authController.restrictTo("admin"), uploadmiddleware.uploadImage, uploadmiddleware.uploadResizeImage, categoriesController.updateCategory); // Update a category by ID



export default router;
