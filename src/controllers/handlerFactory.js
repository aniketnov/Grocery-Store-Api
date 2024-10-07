
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";


const getAll = (Model, popOptions) => catchAsync(async (req, res, next) => {

    // 1. Filter
    let filter = {};
    if (req.params.categoryId) filter.category = req.params.categoryId;
    if (req.params.subCategoryId) filter.subcategory = req.params.subCategoryId;

    // 2. Filtering from query
    let queryObj = { ...req.query };
    const excludeFields = ['sort', 'page', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    queryObj = JSON.parse(queryStr);

    // 3. Combine filters with queryObj
    filter = { ...filter, ...queryObj };

    // 4. Mongoose query initialization
    let query = Model.find(filter);

    // 5. Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy); // Apply sorting on query
    } else {
        query = query.sort('-createdAt'); // Default sorting by creation date
    }

    // limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields)
    } else {
        query = query.select('-__v')
    }

    // limit(page) = Pagination
    if (req.query.page || req.query.limit) {
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 10;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);
    }


    // 6. Populating (optional)
    if (popOptions) query = query.populate(popOptions);

    // 7. Execute the query
    const doc = await query;

    // 8. Check if document exists
    if (!doc) {
        return next(AppError("No Document Found", 404));

    }

    // 9. Send response
    res.status(200).json({
        status: 'success',
        total: doc.length,
        data: doc,
    });

});


const CreateOne = Model => catchAsync(async (req, res, next) => {


    const doc = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
});

const getOne = (Model, popOtions) => async (req, res, next) => {

    let query = Model.findById(req.params.id)
    if (popOtions) query = query.populate(popOtions)
    const doc = await query;
    if (!doc) return next(AppError("No Document Found with This Id", 404));

    res.status(200).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
}

const deleteOne = Model => async (req, res, next) => {

    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(AppError("No Document Found with This Id", 404));
    res.status(204).json({
        status: 'success',
        data: null
    });
}

const updateOne = Model => async (req, res, next) => {

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true
    });
    if (!doc) return next(AppError("No Document Found with This Id", 404));

    res.status(200).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
}



export default { getAll, CreateOne, getOne, deleteOne, updateOne }