const _ = require("lodash");

const getInforData = ({ fileds = [], obj = {} }) => {
  return _.pick(obj, fileds);
};
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};
const unGetSelectData = (unSelect = []) => {
  return Object.fromEntries(unSelect.map((item) => [item, 0]));
};
module.exports = {
  getInforData,
  getSelectData,
  unGetSelectData,
};
