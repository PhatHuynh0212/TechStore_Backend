const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");

const createUser = async (req, res) => {
    try {
        // console.log(req.body);
        const { name, email, password, confirmPassword, phone } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);
        // Check information
        if (!email || !password || !confirmPassword) {
            return res.status(200).json({
                status: "ERR",
                message: "The input is required",
            });
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: "ERR",
                message: "The input is email",
            });
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: "ERR",
                message: "The password is equal confirmPassword",
            });
        }
        // Get request body into service
        const response = await UserService.createUser(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        // console.log(req.body);
        const { email, password } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);
        // Check information
        if (!email || !password) {
            return res.status(200).json({
                status: "ERR",
                message: "The input is required",
            });
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: "ERR",
                message: "The input is email",
            });
        }
        // Get request body into service
        const response = await UserService.loginUser(req.body);
        const { refresh_token, ...newResponse } = response;
        // console.log("response: ", response);
        res.cookie("refresh_token", refresh_token, {
            // Chỉ lấy đc qua http
            HttpOnly: true,
            // Khi deploy sẽ đổi true
            Secure: false,
            // Chỉ gửi cookie khi điều hướng trong cùng site
            SameSite: "Strict",
        });
        return res.status(200).json(newResponse);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;

        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "The userId is required",
            });
        }

        // Get request body into service
        const response = await UserService.updateUser(userId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "The userId is required",
            });
        }

        // Get request body into service
        const response = await UserService.deleteUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const deleteManyUser = async (req, res) => {
    try {
        // Id array
        const ids = req.body.ids;

        if (!ids) {
            return res.status(200).json({
                status: "ERR",
                message: "The ids is required",
            });
        }

        // Get request body into service
        const response = await UserService.deleteManyUser(ids);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const getAllUser = async (req, res) => {
    try {
        const { limit, page } = req.query;
        // Get request body into service
        const response = await UserService.getAllUser(
            Number(limit) || 8,
            Number(page) || 0
        );
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "The userId is required",
            });
        }

        // Get request body into service
        const response = await UserService.getDetailsUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refresh_token;

        if (!token) {
            return res.status(200).json({
                status: "ERR",
                message: "The token is required",
            });
        }

        // Get request body into service
        const response = await JwtService.refreshTokenJwtService(token);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("refresh_token");
        return res.status(200).json({
            status: "OK",
            message: "Logout successfully",
        });
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    deleteManyUser,
};
