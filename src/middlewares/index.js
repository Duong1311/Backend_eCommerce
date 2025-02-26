const discordLogV2 = require("../loggers/discord.log.v2");

const pushToLogDiscord = async (req, res, next) => {
  try {
    discordLogV2.sendToFormatCode({
      title: `Method: ${req.method}`,
      code: req.method === "GET" ? req.query : req.body,
      message: `URL: ${req.protocol}://${req.get("host")}${req.originalUrl}`,
    });
    return next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  pushToLogDiscord,
};
