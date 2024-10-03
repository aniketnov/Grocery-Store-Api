import Subcategory from "./../models/subcategories.model.js"
import handlerFactory from "./handlerFactory.js";




const setCategory = (req, res, next) => {

    if (!req.body.category) {
        req.body.category = req.params.categoryId;
    }
    next();
};

const getAllSubcategores = handlerFactory.getAll(Subcategory)
const createSubcategory = handlerFactory.CreateOne(Subcategory)

const getSubcategory = handlerFactory.getOne(Subcategory, {
    path: 'products',
    select: '-__v -createdAt -updatedAt'
})

const deleteSubcategory = handlerFactory.deleteOne(Subcategory)

const updateSubcategory = handlerFactory.updateOne(Subcategory)


export default {
    getAllSubcategores,
    updateSubcategory,
    deleteSubcategory,
    getSubcategory,
    createSubcategory,
    setCategory
}