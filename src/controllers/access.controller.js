const accessService = require("../services/access.service");
const { CREATED, OK, SuccessResponse } = require("../core/success.response");

const accessController = {
  handleRefresshToken: async (req, res, next) => {
    const result = await accessService.handleRefresshToken(
      req.body.refreshToken
    );
    new SuccessResponse({
      message: "Refresh token successfully",
      metadata: result,
    }).send(res);
  },
  logout: async (req, res, next) => {
    const result = await accessService.logout(req.keyStore);
    new SuccessResponse({
      message: "Logout successfully",
      metadata: result,
    }).send(res);
  },
  login: async (req, res, next) => {
    const result = await accessService.login(req.body);
    new SuccessResponse({
      message: "Login successfully",
      metadata: result,
    }).send(res);
  },
  signUp: async (req, res, next) => {
    const result = await accessService.signUp(req.body);
    new CREATED({
      message: "Register successfully",
      metadata: result,
      options: {
        message: "Register successfully",
      },
    }).send(res);
  },
};

module.exports = accessController;
