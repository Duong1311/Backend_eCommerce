const { model, Schema } = require("mongoose");
const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "orders";
// Declare the Schema of the Mongo model
const orderSchema = new Schema(
  {
    order_userId: { type: Number, required: true },
    order_checkout: {
      type: Object,
      required: true,
      default: {},
    },
    /**
         order_checkout: {
            totalPrice: 0, //tong tien
            freeShip: 0, //phi van chuyen
            totalDiscount: 0, //tong giam gia
            totalCheckout: 0, //tien phai thanh toan
         }
     */
    order_shipping: { type: Object, required: true, default: {} },
    /**
            order_shipping: {
              street,
                city,
                state,
                country,
            }
     */
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, required: true },
    order_trackingNumber: { type: String, default: "#0011722025" },
    order_status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "confirmed",
        "shipping",
        "delivered",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, orderSchema);
