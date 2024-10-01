import Product from "./../models/products.model.js"; // Correct model import



// GET all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            status: 'success',
            total: products.length,
            data: {
                products,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
};


// POST (create) a new product
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                product,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
};

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                product,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

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


export const updateProduct = async (req, res) => {


    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
            new: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                product,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }
};