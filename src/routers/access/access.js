const express = require("express");
const AccessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const Router = express.Router();

// API đăng ký.
Router.route("/signup").post(asyncHandler(AccessController.signUp));

Router.route("/login").post(asyncHandler(AccessController.login));

// authentication

Router.use(authentication);

// API đăng xuất.
Router.route("/logout").post(asyncHandler(AccessController.logout));

// API làm mới token.
Router.route("/refresh-token").post(
  asyncHandler(AccessController.handleRefresshToken)
);

const ACCESS = Router;

module.exports = ACCESS;
