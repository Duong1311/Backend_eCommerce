/**
 * cart service
 * 1 - add product to cart [user]
 * 2 - reduce product quantity by one [user]
 * 3 - increase product quantity by one [user]
 * 4 - get cart [user]
 * 5 - delete cart [user]
 * 6 - delete product from cart [user]
 */

const { NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const {
  createUserCart,
  updateUserCartQuantity,
} = require("../models/respositories/cart.repo");
const { getProductById } = require("../models/respositories/product_repo");

const CartService = {
  addProductToCart: async ({ userId, product = {} }) => {
    // check cart ton tai chua
    const userCart = await cartModel.findOne({ cart_userId: userId });
    if (!userCart) {
      // tao gio hang moi
      return await createUserCart({ userId, product });
    }
    // gio hang da ton tai nhung chua co san pham
    if (!userCart.cart_products.length) {
      userCart.cart_products.push(product);
      return await userCart.save();
    }
    // gio hang da ton tai va co san pham can them san pham khac
    if (
      !userCart.cart_products.some((p) => p.productId === product.productId)
    ) {
      userCart.cart_products.push(product);
      return await userCart.save();
    }
    // gio hang da ton tai va co san pham
    return await updateUserCartQuantity({ userId, product });
  },

  // update cart
  /**
    shop_order_ids: [
    {
      shopId,
      item_products: [
        {
          productId,
          quantity,
          old_quantity,
          price,
        },
      ],
      version,
    }
    ]
   */

  addToCartV2: async ({ userId, shop_order_ids }) => {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError();

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError("Product do not belong to the shop");
    }
    if (quantity === 0) {
      await this.deleteProductFromCart({ userId, productId });
    }

    return await updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  },
  deleteProductFromCart: async ({ userId, productId }) => {
    const query = {
      cart_userId: userId,
      cart_state: "active",
    };
    const update = {
      $pull: {
        cart_products: {
          productId,
        },
      },
    };
    const deleteCart = await cartModel.findOneAndUpdate(query, update, {
      new: true,
    });

    return deleteCart;
  },

  getListCart: async ({ userId }) => {
    return await cartModel.findOne({ cart_userId: userId });
  },
};
module.exports = CartService;
