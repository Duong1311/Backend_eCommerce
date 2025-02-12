const { getSelectData, unGetSelectData } = require("../../utils");

const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
  model,
}) => {
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const totalPages = await model.countDocuments(filter);
  const totalPage = Math.ceil(totalPages / limit);
  const products = await model
    .find(filter)
    .sort(sortBy)
    .skip(limit * (page - 1))
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean();
  return { products, totalPage };
};
const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
  model,
}) => {
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const totalPages = await model.countDocuments(filter);
  const totalPage = Math.ceil(totalPages / limit);
  const products = await model
    .find(filter)
    .sort(sortBy)
    .skip(limit * (page - 1))
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return { products, totalPage };
};

const checkDiscountExist = async ({ filter, model }) => {
  return await model.findOne(filter).lean();
};

module.exports = {
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  checkDiscountExist,
};
