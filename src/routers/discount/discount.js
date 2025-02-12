const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const DiscountController = require("../../controllers/discount.controller");
const Router = express.Router();

// getAmountDiscount
Router.route("/get-amount-discount").post(
  asyncHandler(DiscountController.getAmountDiscount)
);
// getAllDiscountCodes
Router.route("/get-all-discount-codes").get(
  asyncHandler(DiscountController.getAllDiscountCodes)
);

// getProductWithDiscountCode
Router.route("/get-product-with-discount").get(
  asyncHandler(DiscountController.getProductWithDiscountCode)
);

// authentication

Router.use(authentication);

// createDiscountCode
Router.route("/create-discount").post(
  asyncHandler(DiscountController.createDiscountCode)
);

// deleteDiscountCode
Router.route("/delete-discount-code").delete(
  asyncHandler(DiscountController.deleteDiscountCode)
);
// cancelDiscountCode
Router.route("/cancel-discount-code").delete(
  asyncHandler(DiscountController.cancelDiscountCode)
);

const DISCOUNT = Router;

module.exports = DISCOUNT;
