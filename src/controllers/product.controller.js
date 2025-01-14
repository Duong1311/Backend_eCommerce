const { SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.xxx");

const ProductController = {
  // createProduct: async (req, res, next) => {
  //   new SuccessResponse({
  //     message: "Product created successfully",
  //     metadata: await ProductService.createProduct(req.body.product_type, {
  //       ...req.body,
  //       product_shop: req.user.id,
  //     }),
  //   }).send(res);
  // },
  createProduct: async (req, res, next) => {
    new SuccessResponse({
      message: "Product created successfully",
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.id,
      }),
    }).send(res);
  },
};

module.exports = ProductController;
