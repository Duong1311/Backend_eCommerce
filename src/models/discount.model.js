const { model, Schema } = require("mongoose");
const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";
// Declare the Schema of the Mongo model
const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      default: "fixed_amount", // fixed_amount, percentage
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_max_value: {
      type: Number,
      required: true,
    },

    discount_code: {
      // ma code giam gia
      type: String,
      required: true,
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    discount_max_usage: {
      //so luong su dung toi da
      type: Number,
      default: 1,
    },
    // so lan da su dung
    discount_used_count: {
      type: Number,
      required: true,
    },
    // ai dang su dung
    discount_users_used: {
      type: Array,
      default: [],
    },
    // so luong cho phep moi user dung
    discount_max_usage_per_user: {
      type: Number,
      required: true,
    },
    // gia tri don hang toi thieu de su dung
    discount_min_order_value: {
      type: Number,
      required: true,
    },
    discount_shop_id: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_apply_for: {
      type: String,
      required: true,
      enum: ["specific", "all"],
    },
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
