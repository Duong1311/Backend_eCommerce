const { BadRequestError } = require("../core/error.response");
const inventoryModel = require("../models/inventory.model");
const { getProductById } = require("../models/respositories/product_repo");

const InventoryService = {
  addStockToInventory: async ({
    stock,
    productId,
    shopId,
    location = "unKnow",
  }) => {
    const product = await getProductById(productId);
    if (!product) {
      throw new BadRequestError("Product not exist");
    }
    const query = {
        inven_productId: productId,
        inven_shopId: shopId,
      },
      updateSet = {
        $inc: { inven_stock: stock },
        $set: { inven_location: location },
      },
      options = {
        new: true,
        upsert: true,
      };

    return await inventoryModel.findOneAndUpdate(query, updateSet, options);
  },
};

module.exports = InventoryService;
