const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const ProductController = require("../../controllers/product.controller");
const Router = express.Router();

//search products
Router.route("/search").get(asyncHandler(ProductController.searchProducts));
Router.route("").get(asyncHandler(ProductController.getAllProducts));
Router.route("/:product_id").get(asyncHandler(ProductController.findProduct));

Router.use(authentication);

Router.route("/create-product").post(
  asyncHandler(ProductController.createProduct)
);
Router.route("/update-product/:product_id").patch(
  asyncHandler(ProductController.updateProduct)
);

Router.route("/public/:id").post(asyncHandler(ProductController.publicProduct));
Router.route("/unpublic/:id").post(
  asyncHandler(ProductController.unPublicProduct)
);
// QUERY //
Router.route("/drafts/all").get(
  asyncHandler(ProductController.getAllDraftForShop)
);
Router.route("/public/all").get(
  asyncHandler(ProductController.getAllPublicForShop)
);

const PRODUCT = Router;

module.exports = PRODUCT;
