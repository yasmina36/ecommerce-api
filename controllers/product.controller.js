const Product = require("../models/product.model");
const Category = require("../models/category.model");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");

exports.getAllProducts = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};

    if (req.query.minPrice) {
      filter.price.$gte = Number(req.query.minPrice);
    }

    if (req.query.maxPrice) {
      filter.price.$lte = Number(req.query.maxPrice);
    }
  }

  if (req.query.inStock === "true") {
    filter.stock = { $gt: 0 };
  }

  if (req.query.inStock === "false") {
    filter.stock = 0;
  }

  if (req.query.search) {
    filter.$or = [
      {
        name: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: req.query.search,
          $options: "i",
        },
      },
    ];
  }

  const products = await Product.find(filter).populate("category", "name");

  res.status(200).json({
    status: "success",
    message: "Products retrieved successfully",
    data: products,
  });
});

exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "category",
    "name description"
  );

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product retrieved successfully",
    data: product,
  });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: product,
  });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  if (req.body.category) {
    const category = await Category.findById(req.body.category);

    if (!category) {
      return next(new AppError("Category not found", 404));
    }
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).populate("category", "name description");

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: product,
  });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
    data: null,
  });
});