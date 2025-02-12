/**
 * cart service
 * 1 - add product to cart [user]
 * 2 - reduce product quantity by one [user]
 * 3 - increase product quantity by one [user]
 * 4 - get cart [user]
 * 5 - delete cart [user]
 * 6 - delete product from cart [user]
 */

const cartModel = require("../models/cart.model");
const {
  createUserCart,
  updateUserCartQuantity,
} = require("../models/respositories/cart.repo");

const CartService = {
  addProductToCart: async ({ userId, product = {} }) => {
    // check cart ton tai chua
    const userCart = await cartModel.findOne({ cart_userId: userId }).lean();
    if (!userCart) {
      // tao gio hang moi
      return await createUserCart({ userId, product });
    }
    // gio hang da ton tai nhung chua co san pham
    if (!userCart.cart_products.length) {
      userCart.cart_products.push(product);
      return await userCart.save();
    }

    // gio hang da ton tai va co san pham
    return await updateUserCartQuantity({ userId, product });
  },
};
module.exports = CartService;
