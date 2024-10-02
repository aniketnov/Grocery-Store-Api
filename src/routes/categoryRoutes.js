import express from "express";
import categoriesController from './../controllers/categoriesController.js';
import subcategoriesController from "../controllers/subcategoriesController.js";
import uploadmiddleware from "./../middlewares/uploadImage.js"
import subcategoryRouter from "./../routes/subcategoryRoutes.js"






const router = express.Router();

// router
//     .route('/:id/subcategories')
//     .post(uploadmiddleware.uploadImage, uploadmiddleware.uploadResizeImage, categoriesController.setCategory, subcategoriesController.createSubcategory);

router.use('/:categoryId/subcategories', subcategoryRouter)


// Routes for fetching all categories and creating a new category
router.route("/")
    .get(categoriesController.getAllCategories)  // Get all categories
    .post(uploadmiddleware.uploadImage, uploadmiddleware.uploadResizeImage, categoriesController.createCategory);   // Create a new category

// Routes for a specific category (by ID): get, delete, update
router.route("/:id")
    .get(categoriesController.getCategory)       // caGet a category by ID
    .delete(categoriesController.deleteCategory) // Delete a category by ID
    .patch(uploadmiddleware.uploadImage, uploadmiddleware.uploadResizeImage, categoriesController.updateCategory); // Update a category by ID



export default router;
