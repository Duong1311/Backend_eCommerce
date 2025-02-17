const { convertToObjectId } = require("../../utils");
const inventoryModel = require("../inventory.model");
const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unKnow",
}) => {
  return await inventoryModel.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
};

const reserveInventory = async ({ productId, cartId, quantity }) => {
  const query = {
      inven_productId: convertToObjectId(productId),
      inven_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: { inven_stock: -quantity },
      $push: {
        inven_reservations: {
          cartId,
          quantity,
          createOn: new Date(),
        },
      },
    },
    options = {
      new: true,
      upsert: true,
    };
  return await inventoryModel.updateOne(query, updateSet, options);
};

module.exports = {
  insertInventory,
  reserveInventory,
};
