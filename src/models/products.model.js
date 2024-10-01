import mongoose from "mongoose";
import slugify from "slugify"; // Make sure to install slugify with npm

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        minlength: [3, "Product name must be at least 3 characters long"]
    },
    slug: String,
    brand: {
        type: String,
        trim: true
    },

    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, "Price must be a positive number"] // Added validation for positive price
    },
    subcategory: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Subcategory',
        required: true
    }],
    productImage: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],


}, { timestamps: true }, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

productSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Product = mongoose.model('Product', productSchema);

export default Product; // Use export default for ES module compatibility
