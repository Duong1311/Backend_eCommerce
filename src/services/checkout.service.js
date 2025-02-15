const { BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/respositories/cart.repo");
const {
  checkProductByServer,
} = require("../models/respositories/product_repo");
const { getAmountDiscount } = require("./discount.service");

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
};

module.exports = CheckoutService;
