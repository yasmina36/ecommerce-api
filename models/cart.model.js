const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be less than 0"],
    },
  },
  {
    _id: false,
  }
);

const cartSchema = new mongoose.Schema(
  {
    items: {
      type: [cartItemSchema],
      default: [],
    },

    totalPrice: {
      type: Number,
      default: 0,
      min: [0, "Total price cannot be less than 0"],
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.pre("save", function () {
  this.totalPrice = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;