import multer from "multer"
import sharp from "sharp"

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/temp")
//     },
//     filename: (req, file, cb) => {

//         const ext = file.mimetype.split('/')[1]
//         cb(null, `category-${file.originalname}-${Date.now()}.${ext}`)
//         // category-photo-name-2582582585.jpg 
//     }
// })

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    }
    else {
        cb('please upload a image', false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

const uploadImage = upload.single('image')

const uploadResizeImage = async (req, res, next) => {

    if (!req.file) return next();

    const filename = `category-${req.file.originalname.split('.')[0]}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(270, 396)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/temp/${filename}`);

    req.body.image = filename

    next();
};




const imagesUpload = upload.fields([
    { name: "productImage", maxCount: 1 },
    { name: "images", maxCount: 3 }
])


const resizeImages = async (req, res, next) => {
    if (!req.files.productImage || !req.files.images) return next();

    // 1) Cover image
    req.body.productImage = `product-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.productImage[0].buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/temp/${req.body.productImage}`);

    // 2) images
    req.body.images = [];

    await Promise.all(
        req.files.images.map(async (file, i) => {
            const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

            await sharp(file.buffer)
                .resize(500, 500)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/temp/${filename}`);

            req.body.images.push(filename);
        })
    );

    next();
}




export default {
    imagesUpload,
    resizeImages,
    uploadResizeImage,
    uploadImage
};