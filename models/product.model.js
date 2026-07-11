const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Product price cannot be less than 0"],
    },

    stock: {
      type: Number,
      default: 0,
      min: [0, "Product stock cannot be less than 0"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },

    images: {
      type: [String],
      default: [],
    },

    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function () {
  this.inStock = this.stock > 0;
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;