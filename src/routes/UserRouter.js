const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const {
    authAdminMiddleWare,
    authUserMiddleWare,
} = require("../middleware/authMiddleware");

router.post("/sign-up", UserController.createUser);
router.post("/sign-in", UserController.loginUser);
router.post("/log-out", UserController.logoutUser);
router.put("/update-user/:id", authUserMiddleWare, UserController.updateUser);
router.delete(
    "/delete-user/:id",
    authAdminMiddleWare,
    UserController.deleteUser
);
router.get("/get-all", authAdminMiddleWare, UserController.getAllUser);
router.get(
    "/get-details/:id",
    authUserMiddleWare,
    UserController.getDetailsUser
);
router.post("/refresh-token", UserController.refreshToken);
router.post("/delete-many", authAdminMiddleWare, UserController.deleteManyUser);

module.exports = router;
