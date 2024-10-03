import mongoose from "mongoose";
import slugify from "slugify";



const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Category name is required"]
    },
    image: {
        type: String,
        required: [true, "Category must have a required photo"]
    },
    slug: String,


}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


categorySchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

categorySchema.virtual('subcategories', {
    ref: 'Subcategory',
    foreignField: 'category',
    localField: '_id'
});





// Corrected mongoose model creation
const Category = mongoose.model('Category', categorySchema);

export default Category;
