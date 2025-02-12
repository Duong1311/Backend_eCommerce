/**
     Discount service
    1 - Generate discount code [Shop | Admin]
    2 - Get discount code [Shop | User]
    3 - Get all discount codes  [Shop | User]
    4 - Verify discount code [User]
    5 - Delete discount code [Shop | Admin]
    6 - Cancel discount code [User]
 */

const { filter } = require("lodash");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const { convertToObjectId } = require("../utils");
const { findAllProducts } = require("../models/respositories/product_repo");
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExist,
} = require("../models/respositories/discount_repo");

const DiscountService = {
  createDiscountCode: async (payload) => {
    const {
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_start_date,
      discount_end_date,
      discount_max_usage,
      discount_used_count,
      discount_users_used,
      discount_max_usage_per_user,
      discount_min_order_value,
      discount_shop_id,
      discount_is_active,
      discount_apply_for,
      discount_product_ids,
      discount_max_value,
    } = payload;
    // kiem tra
    if (
      new Date() < Date(discount_start_date) ||
      new Date() > Date(discount_end_date)
    ) {
      throw new BadRequestError("Discount code has expired");
    }

    // create index for discount code
    const foundDiscount = await discountModel
      .findOne({
        discount_code: discount_code,
        discount_shop_id: convertToObjectId(discount_shop_id),
      })
      .lean();
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code already exists");
    }
    if (new Date(discount_start_date) >= new Date(discount_end_date)) {
      throw new BadRequestError("Start date must be less than end date");
    }
    const newDiscount = await discountModel.create({
      discount_name: discount_name,
      discount_description: discount_description,
      discount_type: discount_type,
      discount_value: discount_value,
      discount_max_value: discount_max_value,
      discount_code: discount_code,
      discount_start_date: new Date(discount_start_date),
      discount_end_date: new Date(discount_end_date),
      discount_max_usage: discount_max_usage,
      discount_used_count: discount_used_count,
      discount_users_used: discount_users_used,
      discount_max_usage_per_user: discount_max_usage_per_user,
      discount_min_order_value: discount_min_order_value || 0,
      discount_shop_id: discount_shop_id,
      discount_is_active: discount_is_active,
      discount_apply_for: discount_apply_for,
      discount_product_ids:
        discount_apply_for === "all" ? [] : discount_product_ids,
    });
    return newDiscount;
  },
  updateDiscountCode: async (discountId, payload) => {
    const {
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_start_date,
      discount_end_date,
      discount_max_usage,
      discount_used_count,
      discount_users_used,
      discount_max_usage_per_user,
      discount_min_order_value,
      discount_shop_id,
      discount_is_active,
      discount_apply_for,
      discount_product_ids,
    } = payload;
    // kiem tra
    if (
      new Date() < Date(discount_start_date) ||
      new Date() > Date(discount_end_date)
    ) {
      throw new BadRequestError("Discount code has expired");
    }
    const foundDiscount = await discountModel
      .findOne({
        discount_code: discount_code,
        discount_shop_id: convertToObjectId(discount_shop_id),
      })
      .lean();
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code already exists");
    }
    if (new Date(discount_start_date) >= new Date(discount_end_date)) {
      throw new BadRequestError("Start date must be less than end date");
    }
    const updatedDiscount = await discountModel.findByIdAndUpdate(
      discountId,
      {
        discount_name,
        discount_description,
        discount_type,
        discount_value,
        discount_code,
        discount_start_date: new Date(discount_start_date),
        discount_end_date: new Date(discount_end_date),
        discount_max_usage,
        discount_used_count,
        discount_users_used,
        discount_max_usage_per_user,
        discount_min_order_value: discount_min_order_value || 0,
        discount_shop_id,
        discount_is_active,
        discount_apply_for,
        discount_product_ids:
          discount_apply_for === "all" ? [] : discount_product_ids,
      },
      { new: true }
    );
    return updatedDiscount;
  },
  /**
   * Get all product with discount code
   */
  getAllProductWithDiscountCode: async ({ shopId, code, page, limit }) => {
    const discountCodes = await discountModel
      .findOne({
        discount_shop_id: convertToObjectId(shopId),
        discount_code: code,
      })
      .lean();

    if (!discountCodes || !discountCodes.discount_is_active) {
      throw new BadRequestError("Discount code not found");
    }
    const { discount_apply_for, discount_product_ids } = discountCodes;

    let products;
    if (discount_apply_for === "all") {
      //get all product
      products = await findAllProducts({
        filter: { product_shop: convertToObjectId(shopId), isPublic: true },
        limit: limit,
        page: page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    if (discount_apply_for === "specific") {
      // get the products ids
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectId(shopId),
          isPublic: true,
          _id: { $in: discount_product_ids },
        },
        limit: limit,
        page: page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    return products;
  },
  /**
   * Get all discount code of Shop
   */
  getAllDiscountCodesByShop: async ({ limit, page, shopId }) => {
    const discountCodes = await findAllDiscountCodesUnSelect({
      limit,
      page,
      filter: { discount_shop_id: convertToObjectId(shopId) },
      model: discountModel,
      unSelect: ["discount_users_used", "__v", "discount_shop_id"],
    });
    return discountCodes;
  },
  /**
   * Apply discount code
   */
  getAmountDiscount: async ({ code, userId, shopId, products }) => {
    const foundDiscount = await checkDiscountExist({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shop_id: convertToObjectId(shopId),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundError("Discount code not found");
    }
    const {
      discount_type,
      discount_value,
      discount_users_used,
      discount_is_active,
      discount_max_usage,
      discount_min_order_value,
      discount_max_usage_per_user,
    } = foundDiscount;
    if (!discount_is_active) {
      throw new NotFoundError("Discount code has expired");
    }
    if (discount_max_usage <= 0) {
      throw new NotFoundError("Discount code has expired");
    }
    if (
      new Date() < Date(foundDiscount.discount_start_date) ||
      new Date() > Date(foundDiscount.discount_end_date)
    ) {
      throw new NotFoundError("Discount code has expired");
    }
    // check gia tri toi thieu
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);
      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `Order value is bigger than ${discount_min_order_value}`
        );
      }
    }
    // check so lan su dung
    if (discount_max_usage_per_user > 0) {
      const userUsed = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userUsed && userUsed.usedCount > discount_max_usage_per_user) {
        throw new NotFoundError("Discount code has expired");
      }
    }

    //check discount la fixed hay percent
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  },

  /**
   * Delete discount code
   */

  deleteDiscountCode: async ({ code }) => {
    const discount = await discountModel.findById(code);
    if (!discount) {
      throw new NotFoundError("Discount code not found");
    }
    await discountModel.findByIdAndDelete(code);
    return discount;
  },
  /**
   * Cancel discount code
   */
  cancelDiscountCode: async ({ code, userId, shopId }) => {
    const foundDiscount = await checkDiscountExist({
      model: discountModel,
      filter: {
        discount_code: code,
        discount_shop_id: convertToObjectId(shopId),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundError("Discount code not found");
    }
    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: { discount_users_used: userId },
      $inc: { discount_used_count: -1, discount_max_usage: 1 },
    });
    return result;
  },
};
module.exports = DiscountService;
