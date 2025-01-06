const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");
const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //accessToken
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    // const decode = JWT.verify(accessToken, publicKey);
    // console.log(decode);
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    return error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Client ID is required");
  }
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("Key not found");
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Access token is required");
  }
  try {
    const decode = JWT.verify(accessToken, keyStore.publicKey);
    // console.log("=============================", userId);
    // console.log("=============================", decode);
    if (userId !== decode.id) {
      throw new AuthFailureError("Invalid userId");
    }
    req.keyStore = keyStore;

    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  const decode = JWT.verify(token, keySecret);
  return decode;
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
