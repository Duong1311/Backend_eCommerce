const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const CheckoutController = require("../../controllers/checkout.controller");
const Router = express.Router();
Router.use(authentication);

Router.route("/review").post(asyncHandler(CheckoutController.checkoutProducts));

const CHECKOUT = Router;

module.exports = CHECKOUT;
