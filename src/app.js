const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const APIs_V1 = require("./routers");
require("dotenv").config();
const app = express();
// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// init db
require("./dbs/init.mongodb");
// const { checkOverload } = require("./helpers/check.connect");
// checkOverload();
// init routes

app.use("/v1/api/", APIs_V1);

// handle errors

module.exports = app;
