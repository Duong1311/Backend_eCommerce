const {
  Types: { ObjectId },
} = require("mongoose");
const keytokenModel = require("../models/keytoken.model");

const KeyTokenService = {
  deleteKeyById: async (userId) => {
    return await keytokenModel.findOneAndDelete({
      user: userId,
    });
  },
  findByRefreshToken: async (refreshToken) => {
    return await keytokenModel.findOne({
      refreshToken,
    });
  },
  findByRefreshTokenUsed: async (refreshToken) => {
    return await keytokenModel
      .findOne({
        refreshTokensUsed: refreshToken,
      })
      .lean();
  },
  removeKeyById: async (id) => {
    return await keytokenModel.findByIdAndDelete(id);
  },
  findByUserId: async (userId) => {
    return await keytokenModel.findOne({ user: new ObjectId(userId) }).lean();
  },
  createKeyToken: async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      // const token = await keytokenModel.create({
      //   user: userId,
      //   publicKey: publicKey,
      //   privateKey: privateKey,
      // });
      // return token ? token.publicKey : null;

      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const token = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      // console.log("==============", token);
      return token ? token.publicKey : null;
    } catch (error) {
      return error;
    }
  },
};

module.exports = KeyTokenService;
