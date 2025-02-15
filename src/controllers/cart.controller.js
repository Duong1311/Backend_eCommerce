const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

const CartController = {
  addToCart: async (req, res, next) => {
    new SuccessResponse({
      message: "Add to cart successfully",
      metadata: await CartService.addProductToCart({
        ...req.body,
      }),
    }).send(res);
  },
  getCart: async (req, res, next) => {
    new SuccessResponse({
      message: "Get cart successfully",
      metadata: await CartService.getListCart({
        ...req.query,
      }),
    }).send(res);
  },
  updateCart: async (req, res, next) => {
    new SuccessResponse({
      message: "Update cart successfully",
      metadata: await CartService.addToCartV2({
        ...req.body,
      }),
    }).send(res);
  },
  deleteProductFromCart: async (req, res, next) => {
    new SuccessResponse({
      message: "Delete product from cart successfully",
      metadata: await CartService.deleteProductFromCart({
        ...req.body,
      }),
    }).send(res);
  },
};

module.exports = CartController;
