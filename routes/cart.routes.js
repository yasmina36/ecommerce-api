const express = require("express");

const {
  addItemToCart,
  updateCartItem,
  removeCartItem,
  getCart,
  clearCart,
} = require("../controllers/cart.controller");

const router = express.Router();

router.get("/", getCart);
router.delete("/", clearCart);

router.post("/items", addItemToCart);
router.patch("/items/:productId", updateCartItem);
router.delete("/items/:productId", removeCartItem);

module.exports = router;