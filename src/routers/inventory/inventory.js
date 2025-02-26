const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const InventoryController = require("../../controllers/inventory.controller");

const Router = express.Router();
Router.use(authentication);

Router.route("/add-stock").post(
  asyncHandler(InventoryController.addStockToInventory)
);

const INVENTORY = Router;

module.exports = INVENTORY;
