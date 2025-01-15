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

  publicProduct: async (req, res, next) => {
    new SuccessResponse({
      message: "Product is now public",
      metadata: await ProductServiceV2.publicProductByShop({
        product_shop: req.user.id,
        product_id: req.params.id,
      }),
    }).send(res);
  },
  unPublicProduct: async (req, res, next) => {
    new SuccessResponse({
      message: "Product is unpublic",
      metadata: await ProductServiceV2.unPublicProductByShop({
        product_shop: req.user.id,
        product_id: req.params.id,
      }),
    }).send(res);
  },

  // QUERY //
  /**
   * @desc Get all draft products for a shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON} res
   */
  getAllDraftForShop: async (req, res, next) => {
    new SuccessResponse({
      message: "Get list of draft products",
      metadata: await ProductServiceV2.findAllDraftsForShop({
        product_shop: req.user.id,
      }),
    }).send(res);
  },
  /**
   * @desc Get all public products for a shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON} res
   */

  getAllPublicForShop: async (req, res, next) => {
    new SuccessResponse({
      message: "Get list of public products",
      metadata: await ProductServiceV2.findAllPublicForShop({
        product_shop: req.user.id,
      }),
    }).send(res);
  },
  //search products
  searchProducts: async (req, res, next) => {
    new SuccessResponse({
      message: "Get list of searchProducts",
      metadata: await ProductServiceV2.searchProducts({
        keySearch: req.query.keySearch,
      }),
    }).send(res);
  },

  // END QUERY //
};

module.exports = ProductController;
