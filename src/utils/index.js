const _ = require("lodash");

const getInforData = ({ fileds = [], obj = {} }) => {
  return _.pick(obj, fileds);
};

module.exports = {
  getInforData,
};
