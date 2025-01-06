const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const crypto = require("crypto"); //built-in module của nodejs
const { getInforData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
const accessService = {
  handleRefresshToken: async (refreshToken) => {
    /*
    1. Kiểm tra refreshToken dã được sử dụng chưa
    */
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      // decode xem la user nao
      const { id } = await verifyJWT(refreshToken, foundToken.privateKey);
      // delete key
      await KeyTokenService.deleteKeyById(id);
      throw new ForbiddenError("Something went wrong !! Please login again");
    }
    //Trường hợp refreshToken đang được sử dụng

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new AuthFailureError("Token không tồn tại");
    }
    const { id, email } = await verifyJWT(refreshToken, holderToken.privateKey);

    const foundShop = await findByEmail(email);
    if (!foundShop) {
      throw new AuthFailureError("Email không tồn tại");
    }
    //create new refreshToken, accessToken
    const tokens = await createTokenPair(
      { id: id, role: foundShop.role, email: email },
      holderToken.publicKey,
      holderToken.privateKey
    );
    if (!tokens) {
      throw new BadRequestError("Tạo token thất bại");
    }
    //update 2 token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });
    return {
      user: { userId: id, email },
      tokens,
    };
  },
  logout: async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    if (!delKey) {
      throw new BadRequestError("Xóa key thất bại");
    }
    return {
      message: "Xoa key thanh cong",
    };
  },
  login: async (data) => {
    const { email, password, refreshToken } = data;

    const foundShop = await findByEmail(email);
    if (!foundShop) {
      throw new BadRequestError("Email không tồn tại");
    }
    const isMatch = bcrypt.compare(password, foundShop.password);
    if (!isMatch) {
      throw new AuthFailureError("Mật khẩu không đúng");
    }
    //create key
    const privateKey = crypto.randomBytes(64).toString("hex"); //accessToken key
    const publicKey = crypto.randomBytes(64).toString("hex"); //refreshToken key
    //create token
    const tokens = await createTokenPair(
      { id: foundShop._id, role: foundShop.role, email: foundShop.email },
      publicKey,
      privateKey
    );
    if (!tokens) {
      throw new BadRequestError("Tạo token thất bại");
    }

    //save key to db
    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInforData({
        fileds: ["_id", "name", "email"],
        obj: foundShop,
      }),
      tokens,
    };
  },
  signUp: async (data) => {
    const { name, email, password } = data;
    const holderShop = await shopModel.findOne({ email }).lean(); //lean() để chuyển đổi dữ liệu trả về từ mongoose sang dạng object
    if (holderShop) {
      throw new BadRequestError("Email đã tồn tại");
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      role: [RoleShop.SHOP],
    });
    if (newShop) {
      //create privateKey, publicKey
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });

      const privateKey = crypto.randomBytes(64).toString("hex"); //accessToken key
      const publicKey = crypto.randomBytes(64).toString("hex"); //refreshToken key

      //create token
      const tokens = await createTokenPair(
        { id: newShop._id, role: newShop.role, email: newShop.email },
        publicKey,
        privateKey
      );
      if (!tokens) {
        throw new BadRequestError("Tạo token thất bại");
      }

      //save publicKey to db

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
      });

      if (!keyStore) {
        throw new BadRequestError("Lưu key token thất bại");
      }
      // const publicKeyObject = crypto.createPublicKey(publicKeyString);

      return {
        shop: getInforData({
          fileds: ["_id", "name", "email"],
          obj: newShop,
        }),
        tokens,
      };
    }
    return {
      metadata: null,
    };
  },
};

module.exports = accessService;
