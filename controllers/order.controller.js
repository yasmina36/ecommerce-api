const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");

const getSessionId = (req) => {
  const sessionId = req.header("x-session-id");

  if (!sessionId) {
    throw new AppError("x-session-id header is required", 400);
  }

  return sessionId.trim();
};

// POST /api/orders
exports.checkout = asyncHandler(async (req, res, next) => {
  const sessionId = getSessionId(req);
  const { shippingAddress } = req.body;

  if (
    !shippingAddress ||
    !shippingAddress.street ||
    !shippingAddress.city ||
    !shippingAddress.country
  ) {
    return next(new AppError("Shipping address is required", 400));
  }

  const cart = await Cart.findOne({ sessionId }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }

  const orderItems = [];
  let totalPrice = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    if (product.stock < item.quantity) {
      return next(
        new AppError(
          `Not enough stock for ${product.name}. Only ${product.stock} available`,
          400
        )
      );
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0] || "",
      price: product.price,
      quantity: item.quantity,
    });

    totalPrice += product.price * item.quantity;
  }

  const orderNumber = `ORD-${Date.now()}`;

  const order = await Order.create({
    orderNumber,
    items: orderItems,
    totalPrice,
    shippingAddress,
  });

  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    product.stock -= item.quantity;
    await product.save();
  }

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

// GET /api/orders
exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

// GET /api/orders/:id
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

// PATCH /api/orders/:id/status
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const allowedStatuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    return next(new AppError("Invalid order status", 400));
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: order,
  });
});
