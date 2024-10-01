import mongoose from "mongoose";
import slugify from "slugify";

const subcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "SubCategory name is required"],
        unique: true
    },
    slug: String,
    image: String,
    category: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    }]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


subcategorySchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

subcategorySchema.virtual('products', {
    ref: 'Product',
    foreignField: 'subcategory',
    localField: '_id'
});

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

export default Subcategory;
