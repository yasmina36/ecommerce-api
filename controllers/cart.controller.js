const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");

// لأن المشروع لا يحتوي على Users حاليًا، سنستخدم Cart واحدة.
const getOrCreateCart = async () => {
  let cart = await Cart.findOne();

  if (!cart) {
    cart = await Cart.create({
      items: [],
      totalPrice: 0,
    });
  }

  return cart;
};

// POST /api/cart/items
exports.addItemToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return next(new AppError("Product ID is required", 400));
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return next(new AppError("Quantity must be a positive integer", 400));
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (product.stock < 1) {
    return next(new AppError("Product is out of stock", 400));
  }

  const cart = await getOrCreateCart();

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      return next(
        new AppError(`Only ${product.stock} items are available in stock`, 400),
      );
    }

    existingItem.quantity = newQuantity;

    // السعر يأتي دائمًا من قاعدة البيانات
    existingItem.price = product.price;
  } else {
    if (quantity > product.stock) {
      return next(
        new AppError(`Only ${product.stock} items are available in stock`, 400),
      );
    }

    cart.items.push({
      product: product._id,
      quantity,
      price: product.price,
    });
  }

  await cart.save();
  await cart.populate("items.product");

  res.status(200).json({
    success: true,
    message: "Item added to cart successfully",
    data: cart,
  });
});

// PATCH /api/cart/items/:productId
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!Number.isInteger(quantity) || quantity < 0) {
    return next(new AppError("Quantity must be a non-negative integer", 400));
  }

  const cart = await getOrCreateCart();

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (itemIndex === -1) {
    return next(new AppError("Product is not in the cart", 404));
  }

  // لو الكمية أصبحت صفرًا، احذف المنتج تلقائيًا
  if (quantity === 0) {
    cart.items.splice(itemIndex, 1);

    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Item removed from cart because quantity became 0",
      data: cart,
    });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (quantity > product.stock) {
    return next(
      new AppError(`Only ${product.stock} items are available in stock`, 400),
    );
  }

  cart.items[itemIndex].quantity = quantity;
  cart.items[itemIndex].price = product.price;

  await cart.save();
  await cart.populate("items.product");

  res.status(200).json({
    success: true,
    message: "Cart item updated successfully",
    data: cart,
  });
});

// DELETE /api/cart/items/:productId
exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const cart = await getOrCreateCart();

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (itemIndex === -1) {
    return next(new AppError("Product is not in the cart", 404));
  }

  cart.items.splice(itemIndex, 1);

  await cart.save();
  await cart.populate("items.product");

  res.status(200).json({
    success: true,
    message: "Item removed from cart successfully",
    data: cart,
  });
});

// GET /api/cart
exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne().populate("items.product");

  // لو مفيش Cart، رجع Cart فاضية وليس 404
  if (!cart) {
    cart = await Cart.create({
      items: [],
      totalPrice: 0,
    });

    await cart.populate("items.product");
  }

  res.status(200).json({
    success: true,
    data: cart,
  });
});

// DELETE /api/cart
exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart();

  cart.items = [];
  cart.totalPrice = 0;

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    data: cart,
  });
});
