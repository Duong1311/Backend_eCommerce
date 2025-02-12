const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");
const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  // REFRESHTOKEN: "refreshtoken",
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
  req.keyStore = keyStore;

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Access token is required");
  }
  try {
    const decode = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decode.id) {
      throw new AuthFailureError("Invalid userId");
    }
    req.user = decode;
    return next();
  } catch (error) {
    //khi client gửi request lên server mà token hết hạn thì server sẽ trả về status code 410 và client phải gửi api refresh token để lấy token mới
    if (error.message?.includes("jwt expired")) {
      return res
        .status(410)
        .json({ message: "Unauthorized! (Token is expired, need refresh)" });
    }
    return res.status(401).json({ message: "Unauthorized!" });
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
