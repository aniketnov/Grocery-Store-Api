import Subcategory from "./../models/subcategories.model.js"




const setCategory = (req, res, next) => {
    if (!req.body.category) {
        req.body.category = req.params.categoryId;
    }
    next();
};

const getAllSubcategores = async (req, res) => {
    try {
        const subCategories = await Subcategory.find();

        res.status(200).json({
            status: 'success',
            total: subCategories.length,
            data: {
                subCategories,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
};
const createSubcategory = async (req, res) => {
    try {

        const subCategory = await Subcategory.create(req.body);


        res.status(201).json({
            status: 'success',
            data: {
                subCategory,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
};

const getSubcategory = async (req, res) => {
    try {
        const subCategory = await Subcategory.findById(req.params.id)
            .populate({
                path: 'products',
                select: '-__v -createdAt -updatedAt'
            });

        res.status(200).json({
            status: 'success',
            data: {
                subCategory,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
};

const deleteSubcategory = async (req, res) => {
    try {
        const subCategory = await Subcategory.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
};

const updateSubcategory = async (req, res) => {

    try {
        const subCategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
            new: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                subCategory,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
};


export default {
    getAllSubcategores,
    updateSubcategory,
    deleteSubcategory,
    getSubcategory,
    createSubcategory,
    setCategory
}