const express = require("express");

const {
  checkout,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/order.controller");

const router = express.Router();

router.post("/", checkout);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);

module.exports = router;