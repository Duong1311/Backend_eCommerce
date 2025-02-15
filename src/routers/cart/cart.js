const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const CartController = require("../../controllers/cart.controller");
const Router = express.Router();
Router.use(authentication);

Router.route("").post(asyncHandler(CartController.addToCart));
Router.route("").get(asyncHandler(CartController.getCart));
Router.route("/update").post(asyncHandler(CartController.updateCart));
Router.route("/delete").delete(
  asyncHandler(CartController.deleteProductFromCart)
);

const CART = Router;

module.exports = CART;
