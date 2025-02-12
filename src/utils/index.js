const { pick, pickBy, isObject, transform } = require("lodash");
const { Types } = require("mongoose");

const convertToObjectId = (id) => {
  return id ? new Types.ObjectId(id) : null;
};

const getInforData = ({ fileds = [], obj = {} }) => {
  return pick(obj, fileds);
};
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};
const unGetSelectData = (unSelect = []) => {
  return Object.fromEntries(unSelect.map((item) => [item, 0]));
};
const removeUndefined = (obj) => {
  return pickBy(obj, (value) => value !== null);
};
const removeUndefinedV2 = (obj) => {
  if (!isObject(obj)) return obj;

  return transform(obj, (result, value, key) => {
    if (isObject(value)) {
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
  convertToObjectId,
};
