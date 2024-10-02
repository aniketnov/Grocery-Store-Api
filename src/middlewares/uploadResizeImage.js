



export const uploadResizeImage = async (req, res, next) => {

    if (!req.file) return next();


    req.file.filename = `category-${req.file.originalname.split('.')[0]}-${Date.now()}.jpeg`;


    await sharp(req.file.buffer)
        .resize(270, 396)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/temp/${req.file.filename}`);

    next();
};

export const resizeImages = async (req, res, next) => {
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