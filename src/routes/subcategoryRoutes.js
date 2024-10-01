import express from "express";
import { createSubcategory, deleteSubcategory, getAllSubcategores, getSubcategory, setSubcategory, updateSubcategory } from "../controllers/subcategoriesController.js";
import { createProduct, } from "../controllers/productController.js";
import { imagesUpload, resizeImages, uploadImage, uploadResizeImage } from "../middlewares/uploadImage.js";



const router = express.Router();


router
    .route('/:id/products')
    .post(imagesUpload, resizeImages, setSubcategory, createProduct);


// Routes for fetching all subcategories and creating a new subcategory
router.route("/")
    .get(getAllSubcategores)  // Get all subcategories
    .post(uploadImage, uploadResizeImage, createSubcategory);  // Create a new subcategory

// Routes for a specific subcategory (by ID): get, delete, update
router.route("/:id")
    .get(getSubcategory)        // Get a subcategory by ID
    .delete(deleteSubcategory)  // Delete a subcategory by ID
    .patch(uploadImage, uploadResizeImage, updateSubcategory);  // Update a subcategory by ID



export default router;
