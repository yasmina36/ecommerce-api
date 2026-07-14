const Product = require("../models/product.model");
const Category = require("../models/category.model");

exports.getAllProducts = async (req, res) => {
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

  // inStock is a virtual field, so filter using stock instead.
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

  const products = await Product.find(filter).populate(
    "category",
    "name description"
  );

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "category",
    "name description"
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    data: product,
  });
};

exports.createProduct = async (req, res) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product,
  });
};

exports.updateProduct = async (req, res) => {
  if (req.body.category) {
    const category = await Category.findById(req.body.category);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
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
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    data: product,
  });
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};
