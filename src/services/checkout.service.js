const { get } = require("lodash");
const { BadRequestError } = require("../core/error.response");
const orderModel = require("../models/order.model");
const { findCartById } = require("../models/respositories/cart.repo");
const {
  checkProductByServer,
} = require("../models/respositories/product_repo");
const { getAmountDiscount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

const CheckoutService = {
  /*
    {
        cartId,
        userId,
        shop_order_ids: [
            {
                shopId,
                shop_discounts:[],
                item_products: [
                    {
                        productId,
                        quantity,
                        price,
                    
                    }            
                ],
            },
            {
                shopId,
                shop_discounts:[
                    {
                       shopId,
                       discountId,
                       codeId,
                    }
                ],
                item_products: [
                    {
                        productId,
                        quantity,
                        price,
                    
                    }
                ],
            }
        ]
    
    }
     */
  checkoutReview: async ({ cartId, userId, shop_order_ids }) => {
    //check cartId ton tai
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      throw new BadRequestError("Cart not found");
    }
    const checkout_order = {
      totalPrice: 0, //tong tien
      freeShip: 0, //phi van chuyen
      totalDiscount: 0, //tong giam gia
      totalCheckout: 0, //tien phai thanh toan
    };
    const shop_order_ids_new = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      //check product available
      const checkProductServer = await checkProductByServer(item_products);
      if (!checkProductServer[0]) {
        throw new BadRequestError("Product not found");
      }
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);

      // tong tien truoc khi xu ly
      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, //tong tien truoc khi xu ly
        priceApplyDiscount: checkoutPrice, //tong tien sau khi xu ly
        item_products: checkProductServer,
      };
      // neu shop_discounts ton tai, check xem co hop le khong
      if (shop_discounts.length > 0) {
        // gia su co 1 discount
        const { totalPrice, discount } = await getAmountDiscount({
          code: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });

        // tong tien sau khi discount
        checkout_order.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      // thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }
    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  },

  orderByUser: async ({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) => {
    const { shop_order_ids_new, checkout_order } = await this.checkoutReview({
      cartId,
      userId,
      shop_order_ids,
    });

    //check lai so luong san pham xem co vuot ton kho khong
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log(products);
    const acpuireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acpuireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    // neu co san pham vuot ton kho
    if (acpuireProduct.includes(false)) {
      throw new BadRequestError("Product out of stock");
    }

    const newOrder = await orderModel.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    // sau khi tao order thanh cong, xoa cart
    if (newOrder) {
      // xoa cart
    }
    return newOrder;
  },

  /**
   * Query order by user [User]
   */
  getOrderByUser: async ({ userId, page, limit }) => {
    // const orders = await orderModel
    //   .find({ order_userId: userId })
    //   .limit(limit)
    //   .skip(page * limit)
    //   .lean();
    // return orders;
  },
  /**
   * Get order by id [User]
   */
  getOneOrderById: async ({ orderId }) => {
    // const order = await orderModel.findOne({ _id: orderId }).lean();
    // return order;
  },
  /**
   * Cancel order by id [User]
   */

  cancelOrderByUser: async ({ orderId }) => {
    // const order = await orderModel.findOneAndUpdate(
    //   { _id: orderId },
    //   { order_status: "cancel" },
    //   { new: true }
    // );
    // return order;
  },
  /**
   * Update order status [Admin] [Shop]
   */
  updateOrderStatus: async ({ orderId, status }) => {},
};

module.exports = CheckoutService;
