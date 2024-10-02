import Category from "./../models/categories.model.js"
import handlerFactory from "./handlerFactory.js";

const getAllCategories = handlerFactory.getAll(Category, {
    path: 'subcategories',
    select: '-__v'
})
const createCategory = handlerFactory.CreateOne(Category)
const getCategory = handlerFactory.getOne(Category)
const deleteCategory = handlerFactory.deleteOne(Category)
const updateCategory = handlerFactory.updateOne(Category)


export default {
    getAllCategories,
    updateCategory,
    deleteCategory,
    getCategory,
    createCategory,

};

