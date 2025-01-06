const express = require("express");
const accessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const Router = express.Router();

// API đăng ký.
Router.route("/signup").post(asyncHandler(accessController.signUp));

Router.route("/login").post(asyncHandler(accessController.login));

// authentication

Router.use(authentication);

// API đăng xuất.
Router.route("/logout").post(asyncHandler(accessController.logout));

// API làm mới token.
Router.route("/refresh-token").post(
  asyncHandler(accessController.handleRefresshToken)
);

const ACCESS = Router;

module.exports = ACCESS;
