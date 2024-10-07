import express from "express";
import subcategoriesController from "../controllers/subcategoriesController.js";
import uploadmiddleware from "./../middlewares/uploadImage.js"
import productRouter from "./../routes/productRoutes.js";
import authController from "../controllers/authController.js";


const router = express.Router({ mergeParams: true });


router.use('/:subCategoryId/prn', productRouter)

// Routes for fetching all subcategories and creating a new subcategory


router.route("/")
    .get(subcategoriesController.getAllSubcategories)  // Get all subcategories
    .post(authController.protect, authController.restrictTo("admin"), uploadmiddleware.uploadImage, uploadmiddleware.uploadResizeImage, subcategoriesController.setCategory, subcategoriesController.createSubcategory);  // Create a new subcategory

// Routes for a specific subcategory (by ID): get, delete, update
router.route("/:id")
    .get(subcategoriesController.getSubcategory)        // Get a subcategory by ID
    .delete(authController.protect, authController.restrictTo("admin"), subcategoriesController.deleteSubcategory)  // Delete a subcategory by ID
    .patch(authController.protect, authController.restrictTo("admin"), uploadmiddleware.uploadImage, uploadmiddleware.uploadResizeImage, subcategoriesController.updateSubcategory);  // Update a subcategory by ID



export default router;
