const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const crypto = require("crypto"); //built-in module của nodejs
const { getInforData } = require("../utils");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
const accessService = {
  signUp: async (data) => {
    try {
      const { name, email, password } = data;
      const holderShop = await shopModel.findOne({ email }).lean(); //lean() để chuyển đổi dữ liệu trả về từ mongoose sang dạng object
      if (holderShop) {
        return {
          code: "",
          message: "Email đã tồn tại",
          status: "error",
        };
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

        //save publicKey to db

        const keyStore = await KeyTokenService.createKeyToken(
          newShop._id,
          publicKey,
          privateKey
        );

        if (!keyStore) {
          return {
            code: "",
            message: "Tạo key token thất bại",
          };
        }
        // const publicKeyObject = crypto.createPublicKey(publicKeyString);
        //create token
        const tokens = await createTokenPair(
          { id: newShop._id, role: newShop.role, email: newShop.email },
          publicKey,
          privateKey
        );
        if (!tokens) {
          return {
            code: "",
            message: "Tạo token thất bại",
          };
        }
        return {
          code: 201,
          metadata: {
            shop: getInforData({
              fileds: ["_id", "name", "email"],
              obj: newShop,
            }),
            tokens,
          },
        };
      }
      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "",
        message: error.message,
        status: "error",
      };
    }
  },
};

module.exports = accessService;
