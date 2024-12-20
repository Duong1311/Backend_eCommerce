const express = require("express");
const accessController = require("../../controllers/access.controller");
const Router = express.Router();

// API đăng ký.
Router.route("/signup").post(accessController.signUp);

// // API đăng nhập.
// Router.route("/login").post(userController.login);

// // API đăng xuất.
// Router.route("/logout").delete(userController.logout);

const ACCESS = Router;

module.exports = ACCESS;
