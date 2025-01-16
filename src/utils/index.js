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
const removeUndefined = (obj) => {
  return _.pickBy(obj, (value) => value !== null);
};
const removeUndefinedV2 = (obj) => {
  if (!_.isObject(obj)) return obj;

  return _.transform(obj, (result, value, key) => {
    if (_.isObject(value)) {
      value = removeUndefined(value);
    }
    if (value !== undefined && value !== null) {
      result[key] = value;
    }
  });
};

const updateNestedObjectParse = (object) => {
  const final = {};

  Object.keys(object || {}).forEach((key) => {
    if (typeof object[key] === "object" && !Array.isArray(object[key])) {
      const response = updateNestedObjectParse(object[key]);

      Object.keys(response || {}).forEach((a) => {
        final[`${key}.${a}`] = response[a];
      });
    } else {
      final[key] = object[key];
    }
  });

  return final;
};
module.exports = {
  getInforData,
  getSelectData,
  unGetSelectData,
  removeUndefined,
  updateNestedObjectParse,
  removeUndefinedV2,
};
