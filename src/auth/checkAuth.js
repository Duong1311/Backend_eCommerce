const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const { findByKey } = require("../services/apikey.service");

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({ message: "Forbidden" });
    }
    //check objKey

    const objKey = await findByKey(key);
    // console.log("sdsdsd", objKey);
    if (!objKey) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    console.error("error", error);
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // console.log("permission", req.objKey.permissions);

    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({ message: "Permission denied" });
    }
    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};
