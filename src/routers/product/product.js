const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const ProductController = require("../../controllers/product.controller");
const Router = express.Router();

Router.use(authentication);

Router.route("/create-product").post(
  asyncHandler(ProductController.createProduct)
);

const PRODUCT = Router;

module.exports = PRODUCT;
