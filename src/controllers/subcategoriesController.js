import Subcategory from "./../models/subcategories.model.js"


export const setSubcategory = (req, res, next) => {
    if (!req.body.subcategory) req.body.subcategory = req.params.id
    next()
}

export const getAllSubcategores = async (req, res) => {
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
export const createSubcategory = async (req, res) => {

    if (req.file) {
        req.body.image = req.file.filename;
    }
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

export const getSubcategory = async (req, res) => {
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

export const deleteSubcategory = async (req, res) => {
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

export const updateSubcategory = async (req, res) => {
    if (req.file) {
        req.body.image = req.file.filename;
    }
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