const express = require("express");
const ACCESS = require("./access/access");
const { apiKey, permission } = require("../auth/checkAuth");
const Router = express.Router();

/** Check APIs v1/status */
Router.get("/status", (req, res) => {
  res.status(200).json({ message: "APIs V1 are ready to use." });
});

// check apiKey
Router.use(apiKey);

//check permission
Router.use(permission("0000"));

//check permission

Router.use("/shop", ACCESS);

const APIs_V1 = Router;

module.exports = APIs_V1;
