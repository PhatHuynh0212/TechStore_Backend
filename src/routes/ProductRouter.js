const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const { authAdminMiddleWare } = require("../middleware/authMiddleware");

router.post("/create", ProductController.createProduct);
router.put("/update/:id", authAdminMiddleWare, ProductController.updateProduct);
router.get("/get-details/:id", ProductController.getDetailsProduct);
router.delete(
    "/delete/:id",
    authAdminMiddleWare,
    ProductController.deleteProduct
);
router.get("/get-all", ProductController.getAllProduct);
router.get("/get-all-type", ProductController.getAllType);
router.post(
    "/delete-many",
    authAdminMiddleWare,
    ProductController.deleteManyProduct
);

module.exports = router;
