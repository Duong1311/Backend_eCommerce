const express = require("express");
const ACCESS = require("./access/access");
const Router = express.Router();

/** Check APIs v1/status */
Router.get("/status", (req, res) => {
  res.status(200).json({ message: "APIs V1 are ready to use." });
});

Router.use("/shop", ACCESS);

const APIs_V1 = Router;

module.exports = APIs_V1;
