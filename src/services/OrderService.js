const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

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
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        // Check số lượng đủ để bán
                        countInStock: { $gte: order.amount },
                    },
                    {
                        $inc: {
                            // Giảm số lượng tồn kho
                            countInStock: -order.amount,
                            // Tăng lượt bán
                            selled: +order.amount,
                        },
                    },
                    {
                        new: true,
                    }
                );
                if (productData) {
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
                        return {
                            status: "OK",
                            message: "SUCCESS",
                            // data: newOrder,
                        };
                    }
                } else {
                    return {
                        status: "OK",
                        message: "ERROR",
                        id: order.product,
                    };
                }
            });
            const results = await Promise.all(promises);
            const newData = results.filter((item) => {
                item.data;
            });
            if (newData.length) {
                resolve({
                    status: "ERR",
                    message: `Product with id-${newData.join(
                        ","
                    )} is out of stock!`,
                });
            }
            resolve({
                status: "OK",
                message: "Success",
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id,
            });

            if (order === null) {
                resolve({
                    status: "OK",
                    message: "The order is not defined",
                });
            }

            resolve({
                status: "OK",
                message: "SUCCESS",
                data: order,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({
                _id: id,
            });

            if (order === null) {
                resolve({
                    status: "OK",
                    message: "The order is not defined",
                });
            }

            resolve({
                status: "OK",
                message: "SUCCESS",
                data: order,
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createOrder,
    getAllDetailsOrder,
    getDetailsOrder,
};
