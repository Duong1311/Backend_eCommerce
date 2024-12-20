const accessService = require("../services/access.service");

const accessController = {
  signUp: async (req, res, next) => {
    try {
      const result = await accessService.signUp(req.body);
      res.status(201).json({
        code: "",
        metadata: { result },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = accessController;
