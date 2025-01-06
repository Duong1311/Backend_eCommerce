const apiKeyModel = require("../models/apikey.model");
// const crypto = require("crypto");
const findByKey = async (key) => {
  const objKey = await apiKeyModel.findOne({ key: key, status: true }).lean();
  return objKey;
};

module.exports = {
  findByKey,
};
