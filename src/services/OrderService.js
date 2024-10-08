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
            const outOfStockItems = [];

            const updateProductPromises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }, // Kiểm tra đủ hàng
                    },
                    {
                        $inc: {
                            countInStock: -order.amount, // Giảm số lượng tồn kho
                            selled: +order.amount, // Tăng số lượng đã bán
                        },
                    },
                    {
                        new: true,
                    }
                );
                if (!productData) {
                    outOfStockItems.push(order.product);
                }
            });

            await Promise.all(updateProductPromises);

            if (outOfStockItems.length > 0) {
                return resolve({
                    status: "ERR",
                    message: `Product với id-${outOfStockItems.join(
                        ","
                    )} đã hết hàng!`,
                });
            }

            const newOrderCreated = await Order.create({
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

            // Nếu tạo thành công, trả về kết quả thành công
            if (newOrderCreated) {
                return resolve({
                    status: "OK",
                    message: "SUCCESS",
                    // data: newOrderCreated,
                });
            }
        } catch (e) {
            return reject(e);
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

const cancelOrderDetails = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = [];
            const promises = data?.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        selled: { $gte: order.amount },
                    },
                    {
                        $inc: {
                            // Tăng lượng tồn kho
                            countInStock: +order.amount,
                            // Giảm lượt bán
                            selled: -order.amount,
                        },
                    },
                    {
                        new: true,
                    }
                );
                if (productData) {
                    order = await Order.findByIdAndDelete(id);
                    if (order === null) {
                        resolve({
                            status: "OK",
                            message: "The order is not defined",
                        });
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
            const newData = results && results.filter((item) => item);
            if (newData.length) {
                resolve({
                    status: "ERR",
                    message: `Product with id-${newData.join(
                        ","
                    )} is undefined!`,
                });
            }
            resolve({
                status: "OK",
                message: "Success",
                data: order,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find();

            resolve({
                status: "OK",
                message: "GET ALL USER SUCCESS",
                data: allOrder,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const updateOrder = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkOrder = await Order.findOne({
                _id: id,
            });

            if (checkOrder === null) {
                resolve({
                    status: "OK",
                    message: "The order is not defined",
                });
            }

            const updatedOrder = await Order.findByIdAndUpdate(id, data, {
                new: true,
            });

            resolve({
                status: "OK",
                message: "SUCCESS",
                data: updatedOrder,
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
    cancelOrderDetails,
    getAllOrder,
    updateOrder,
};
