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
    discountPrice: {
        type: Number,
        validate: {
            validator: function (value) {
                return value < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
        }
    },
    weight: {
        type: String,
        required: [true, "Product weight is required"],
        validate: {
            validator: function (value) {
                // Regular expression to allow formats like 500g, 1kg, 2L, 1unit
                return /^(?:\d+(?:\.\d+)?)(g|kg|L|unit)$/.test(value);
            },
            message: "({VALUE}) is not a valid weight! Must be in the format of '500g', '1kg', '2L', or '1unit'."
        },
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        required: [true, "Product description is required"],
        maxlength: [2000, "Description should not exceed 2000 characters"],
    },
    stock: {
        type: Number,
        required: [true, "Stock is required"],
        min: [0, "Stock can't be negative"],
        default: 1,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    'country Of Origin': {
        type: String,
        required: [true, "Country of origin is required"],
        trim: true,

    },

    "Shelf Life": {
        type: Number,
        min: [0, "ShelfLife can't be negative"],
        default: 1,
    },
    Type: {
        type: String
    },
    "Manufacturer Details": {
        type: String
    },
    'Marketed By': {
        type: String
    },
    ingredients: [{
        type: String,

    }],
    'Expiration Date': {
        type: Date,
        validate: {
            validator: function (value) {
                return value > new Date(); // Ensure the expiration date is in the future
            },
            message: "Expiration date must be in the future.",
        },
    },
    productImage: {
        type: String,

    },
    images: [String],


    subcategory: {
        type: mongoose.Schema.ObjectId,
        ref: 'Subcategory',
        required: true
    },




}, { timestamps: true }, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

productSchema.virtual("discountPercentage").get(function () {
    if (this.price > 0 && this.discountPrice > 0) {
        return ((this.price - this.discountPrice) / this.price) * 100;
    }
    return 0; // Return 0 if there is no discount or price is 0
});

productSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Product = mongoose.model('Product', productSchema);

export default Product; // Use export default for ES module compatibility


// Sumeru Malai Chicken Seekh Kebab, Licious Chicken Curry Cut, Godrej Real Good Chicken Breast (Boneless), Zorabian Mince Chicken Keema, Meatzza Fresh Boneless Chicken Breast (Frozen), Meatigo By Prasuma Antibiotic-Free Boneless Chicken Breast (Frozen), Godrej Yummiez Pepper & Herb Chicken Sausage (Frozen)
// Licious,Godrej Real Good, Prasuma, Zorabian, Meatzza,Meatigo, ITC Master Chef, Venky's, Godrej Yummiez, 