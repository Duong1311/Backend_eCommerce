const { Types } = require("mongoose");
const { product } = require("../product.model");
const {
  getSelectData,
  unGetSelectData,
  convertToObjectId,
} = require("../../utils");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};
const findAllPublicForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};
const searchProductsByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch, "i");
  const result = await product
    .find(
      {
        isPublic: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return result;
};

const publicProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublic = true;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const unPublicProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublic = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};
const findProduct = async ({ product_id, unSelect }) => {
  return await product
    .findById(product_id)
    .select(unGetSelectData(unSelect))
    .lean();
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const totalPages = await product.countDocuments(filter);
  const totalPage = Math.ceil(totalPages / limit);
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(limit * (page - 1))
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return { products, totalPage };
};

const updateProductById = async ({
  product_id,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  // console.log(bodyUpdate);
  return await model.findByIdAndUpdate(product_id, bodyUpdate, {
    new: isNew,
  });
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};
const getProductById = async (productId) => {
  return await product.findOne({ _id: convertToObjectId(productId) }).lean();
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.productId);
      if (foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: product.quantity,
          productId: product.productId,
        };
      }
    })
  );
};

module.exports = {
  checkProductByServer,
  findAllDraftsForShop,
  publicProductByShop,
  findAllPublicForShop,
  unPublicProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductById,
};
