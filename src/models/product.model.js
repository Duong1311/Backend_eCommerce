const mongoose = require("mongoose"); // Erase if already required
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
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

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

//Export the model
// module.exports = mongoose.model(DOCUMENT_NAME, productSchema);

module.exports = {
  product: mongoose.model(DOCUMENT_NAME, productSchema),
  electronic: mongoose.model("Electronic", electronicSchema),
  clothing: mongoose.model("Clothing", clothingSchema),
};
