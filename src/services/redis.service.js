const redis = require("redis");
const { promisify } = require("util");
const { reserveInventory } = require("../models/respositories/inventory.repo");
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2025_${productId}`;
  const retryTime = 10;
  const expireTime = 3000; //3 seconds
  for (let i = 0; i < retryTime; i++) {
    // tao mot key, ai set duoc key do thi co quyen thuc hien
    const result = await setnxAsync(key, expireTime);
    console.log("result", result);
    if (result === 1) {
      // thao tac voi inventory
      const isReversation = await reserveInventory({
        productId,
        cartId,
        quantity,
      });
      if (isReversation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      // wait 100ms
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
