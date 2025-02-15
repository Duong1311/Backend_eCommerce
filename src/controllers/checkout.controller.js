const CheckoutService = require("../services/checkout.service");

const CheckoutController = {
  checkoutProducts: async (req, res, next) => {
    new SuccessResponse({
      message: "Checkout products successfully",
      metadata: await CheckoutService.checkoutReview({
        ...req.body,
      }),
    }).send(res);
  },
};
module.exports = CheckoutController;
