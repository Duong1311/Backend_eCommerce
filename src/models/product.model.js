const mongoose = require("mongoose"); // Erase if already required
const slugify = require("slugify");
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String, required: true },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_slug: { type: String },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    product_attributes: { type: mongoose.Schema.Types.Mixed, require: true },
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false, // Hide this field from the query result
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
      select: false, // Hide this field from the query result
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
// create index for search

productSchema.index({ product_name: "text", product_description: "text" });

// Document middleware: runs before .save() and .create()

productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

const electronicSchema = new mongoose.Schema(
  {
    manufacture: { type: String, require: true },
    model: { type: String, require: true },
    color: String,
  },
  {
    timestamps: true,
    collection: "Electronics",
  }
);
const clothingSchema = new mongoose.Schema(
  {
    band: { type: String, require: true },
    size: { type: String, require: true },
    material: String,
  },
  {
    timestamps: true,
    collection: "Clothings",
  }
);

const furnitureSchema = new mongoose.Schema(
  {
    band: { type: String, require: true },
    size: { type: String, require: true },
    material: String,
  },
  {
    timestamps: true,
    collection: "Furnitures",
  }
);

//Export the model
// module.exports = mongoose.model(DOCUMENT_NAME, productSchema);

module.exports = {
  product: mongoose.model(DOCUMENT_NAME, productSchema),
  electronic: mongoose.model("Electronic", electronicSchema),
  clothing: mongoose.model("Clothing", clothingSchema),
  furniture: mongoose.model("Furniture", furnitureSchema),
};
