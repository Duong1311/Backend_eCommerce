const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //accessToken
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    const decode = JWT.verify(accessToken, publicKey);
    console.log(decode);
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    return error;
  }
};
module.exports = {
  createTokenPair,
};
