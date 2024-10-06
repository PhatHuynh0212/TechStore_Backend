const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
    try {
        const {
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            fullName,
            phone,
            address,
            city,
        } = req.body;

        // Check information
        if (
            !paymentMethod ||
            !itemsPrice ||
            shippingPrice === undefined ||
            shippingPrice === null ||
            !totalPrice ||
            !fullName ||
            !phone ||
            !address ||
            !city
        ) {
            return res.status(200).json({
                status: "ERR",
                message: "The input is required",
            });
        }
        // Get request body into service
        const response = await OrderService.createOrder(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const getAllDetailsOrder = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "The userId is required",
            });
        }

        // Get request body into service
        const response = await OrderService.getAllDetailsOrder(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const getDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        if (!orderId) {
            return res.status(200).json({
                status: "ERR",
                message: "The userId is required",
            });
        }

        // Get request body into service
        const response = await OrderService.getDetailsOrder(orderId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

module.exports = {
    createOrder,
    getAllDetailsOrder,
    getDetailsOrder,
};
