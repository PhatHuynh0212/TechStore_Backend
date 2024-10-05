const Order = require("../models/OrderModel");

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const {
            orderItems,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            fullName,
            phone,
            address,
            city,
            user,
        } = newOrder;
        try {
            const newOrder = await Order.create({
                orderItems,
                shippingAddress: {
                    fullName,
                    phone,
                    address,
                    city,
                },
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
                user: user,
            });
            if (newOrder) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: newOrder,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createOrder,
};
