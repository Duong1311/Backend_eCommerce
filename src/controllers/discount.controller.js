const { get } = require("lodash");
const { CREATED, OK, SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

const DiscountController = {
  createDiscountCode: async (req, res, next) => {
    new SuccessResponse({
      message: "Create discount successfully",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        discount_shop_id: req.user.id,
      }),
    }).send(res);
  },
  getProductWithDiscountCode: async (req, res, next) => {
    new SuccessResponse({
      message: "Get discount code successfully",
      metadata: await DiscountService.getAllProductWithDiscountCode({
        ...req.query,
        // shopId: req.user.id,
      }),
    }).send(res);
  },
  getAllDiscountCodes: async (req, res, next) => {
    new SuccessResponse({
      message: "Get all discount code successfully",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        // shopId: req.user.id,
      }),
    }).send(res);
  },
  getAmountDiscount: async (req, res, next) => {
    new SuccessResponse({
      message: "Get amount discount successfully",
      metadata: await DiscountService.getAmountDiscount({
        ...req.body,
        // shopId: req.user.id,
      }),
    }).send(res);
  },
  deleteDiscountCode: async (req, res, next) => {
    new SuccessResponse({
      message: "Delete discount code successfully",
      metadata: await DiscountService.deleteDiscountCode({
        code: req.query.code,
      }),
    }).send(res);
  },
  cancelDiscountCode: async (req, res, next) => {
    new SuccessResponse({
      message: "Cancel discount code successfully",
      metadata: await DiscountService.cancelDiscountCode({
        code: req.query.code,
      }),
    }).send(res);
  },
};

module.exports = DiscountController;
