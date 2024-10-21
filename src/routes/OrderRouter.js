const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const {
    authUserMiddleWare,
    authAdminMiddleWare,
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
router.get("/get-all", authAdminMiddleWare, OrderController.getAllOrder);
router.put("/update/:id", authAdminMiddleWare, OrderController.updateOrder);

module.exports = router;
