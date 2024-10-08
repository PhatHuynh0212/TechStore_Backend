const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const {
    authUserMiddleWare,
    authMiddleWare,
} = require("../middleware/authMiddleware");

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
router.delete(
    "/cancel-order/:id",
    authUserMiddleWare,
    OrderController.cancelOrderDetails
);
router.get("/get-all", authMiddleWare, OrderController.getAllOrder);
router.put("/update/:id", authMiddleWare, OrderController.updateOrder);

module.exports = router;
