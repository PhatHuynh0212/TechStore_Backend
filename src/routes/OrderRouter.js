const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const { authUserMiddleWare } = require("../middleware/authMiddleware");

router.post("/create/:id", authUserMiddleWare, OrderController.createOrder);
router.get(
    "/get-all-order/:id",
    authUserMiddleWare,
    OrderController.getAllDetailsOrder
);
router.get(
    "/get-details-order/:id",
    authUserMiddleWare,
    OrderController.getDetailsOrder
);

module.exports = router;
