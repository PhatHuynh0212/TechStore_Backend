const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
    console.log("req: ", req.body);
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
            !shippingPrice ||
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

module.exports = {
    createOrder,
};
