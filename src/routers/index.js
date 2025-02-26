const express = require("express");
const ACCESS = require("./access/access");
const { apiKey, permission } = require("../auth/checkAuth");
const PRODUCT = require("./product/product");
const DISCOUNT = require("./discount/discount");
const CART = require("./cart/cart");
const CHECKOUT = require("./checkout/checkout");
const INVENTORY = require("./inventory/inventory");
const { pushToLogDiscord } = require("../middlewares");
const Router = express.Router();

/** Check APIs v1/status */
Router.get("/status", (req, res) => {
  res.status(200).json({ message: "APIs V1 are ready to use." });
});
// add log to discord

Router.use(pushToLogDiscord);

// check apiKey
Router.use(apiKey);

//check permission
Router.use(permission("0000"));

//check permission

Router.use("/shop", ACCESS);

Router.use("/product", PRODUCT);

Router.use("/discount", DISCOUNT);

Router.use("/cart", CART);

Router.use("/checkout", CHECKOUT);

Router.use("/inventory", INVENTORY);

const APIs_V1 = Router;

module.exports = APIs_V1;
