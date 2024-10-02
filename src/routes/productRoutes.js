import express from "express";
import productController from "./../controllers/productController.js";
import uploadmiddleware from "./../middlewares/uploadImage.js"

const router = express.Router({ mergeParams: true });


router.route("/")
    .get(productController.getAllProducts)  // Get all products
    .post(uploadmiddleware.imagesUpload, uploadmiddleware.resizeImages, productController.setSubcategory, productController.createProduct); // Create a new product

// Routes for a specific product (by ID): get, delete, update
router.route("/:id")
    .get(productController.getProduct)       // Get a product by ID
    .delete(productController.deleteProduct) // Delete a product by ID
    .patch(uploadmiddleware.imagesUpload, uploadmiddleware.resizeImages, productController.updateProduct); // Update a product by ID

export default router;

