import Product from "./../models/products.model.js"; // Correct model import
import handlerFactory from "./handlerFactory.js";


const setSubcategory = (req, res, next) => {
    if (!req.body.subcategory) req.body.subcategory = req.params.subCategoryId
    next()
}

// GET all products
const getAllProducts = handlerFactory.getAll(Product)

const createProduct = handlerFactory.CreateOne(Product)

const getProduct = handlerFactory.getOne(Product)

const deleteProduct = handlerFactory.deleteOne(Product)

const updateProduct = handlerFactory.updateOne(Product)

export default {
    getAllProducts,
    updateProduct,
    deleteProduct,
    getProduct,
    createProduct,
    setSubcategory

};