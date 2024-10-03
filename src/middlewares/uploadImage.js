import multer from "multer";
import sharp from "sharp";
import path from "path";
import AppError from "../utils/appError.js";

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new Error('Please upload an image'), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

const uploadImage = upload.single('image');

const uploadResizeImage = async (req, res, next) => {
    if (!req.file) return next();

    const filename = `category-${req.file.originalname.split('.')[0]}-${Date.now()}.jpeg`;

    try {
        await sharp(req.file.buffer)
            .resize(270, 396)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(path.join('public/temp', filename));

        req.body.image = filename;
        next();
    } catch (error) {
        next(new AppError("Error processing image: " + error.message));
    }
};

const imagesUpload = upload.fields([
    { name: "productImage", maxCount: 1 },
    { name: "images", maxCount: 3 },
]);

const resizeImages = async (req, res, next) => {
    if (!req.files.productImage || !req.files.images) return next();


    try {
        // 1) Cover image
        req.body.productImage = `product-${req.params.subCategoryId || req.params.CategoryId}-${Date.now()}-cover.jpeg`;
        await sharp(req.files.productImage[0].buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(path.join('public/temp', req.body.productImage));

        // 2) Additional images
        req.body.images = [];

        await Promise.all(
            req.files.images.map(async (file, i) => {
                const filename = `product-${req.params.subCategoryId || req.params.CategoryId}-${Date.now()}-${i + 1}.jpeg`;

                await sharp(file.buffer)
                    .resize(500, 500)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(path.join('public/temp', filename));

                req.body.images.push(filename);
            })
        );

        next();
    } catch (error) {
        next(new AppError("Error processing images: " + error.message));
    }
};

export default {
    imagesUpload,
    resizeImages,
    uploadResizeImage,
    uploadImage,
};
