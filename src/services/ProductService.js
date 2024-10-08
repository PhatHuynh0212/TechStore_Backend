const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const {
            name,
            image,
            type,
            price,
            countInStock,
            rating,
            description,
            discount,
        } = newProduct;
        try {
            const checkProduct = await Product.findOne({
                name: name,
            });
            if (checkProduct !== null) {
                resolve({
                    status: "ERR",
                    message: "The name of product already exist",
                });
            }
            const newProduct = await Product.create({
                name,
                image,
                type,
                price,
                countInStock,
                rating,
                description,
                discount,
            });
            if (newProduct) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: newProduct,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id,
            });

            if (checkProduct === null) {
                resolve({
                    status: "OK",
                    message: "The product is not defined",
                });
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, data, {
                new: true,
            });

            resolve({
                status: "OK",
                message: "SUCCESS",
                data: updatedProduct,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id,
            });

            if (product === null) {
                resolve({
                    status: "OK",
                    message: "The product is not defined",
                });
            }

            resolve({
                status: "OK",
                message: "SUCCESS",
                data: product,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id,
            });

            if (checkProduct === null) {
                resolve({
                    status: "OK",
                    message: "The product is not defined",
                });
            }

            await Product.findByIdAndDelete(id);

            resolve({
                status: "OK",
                message: "DELETE PRODUCT SUCCESS",
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({ _id: ids });

            resolve({
                status: "OK",
                message: "DELETE MANY PRODUCTS SUCCESS",
            });
        } catch (e) {
            reject(e);
        }
    });
};
//     return new Promise(async (resolve, reject) => {
//         try {
//             let allProduct = [];
//             const totalProduct = await Product.countDocuments();
//             if (filter) {
//                 const label = filter[0];
//                 const allObjectFilter = await Product.find({
//                     [label]: { $regex: filter[1], $options: "i" },
//                 })
//                     .limit(limit)
//                     .skip(limit * page);

//                 resolve({
//                     status: "OK",
//                     message: "GET ALL PRODUCT SUCCESS",
//                     data: allObjectFilter,
//                     totalProduct: totalProduct,
//                     pageCurrent: page + 1,
//                     totalPage: Math.ceil(totalProduct / limit),
//                 });
//             }

//             if (sort) {
//                 const objectSort = {};
//                 objectSort[sort[1]] = sort[0];
//                 const allProductSort = await Product.find()
//                     .limit(limit)
//                     .skip(limit * page)
//                     .sort(objectSort);
//                 resolve({
//                     status: "OK",
//                     message: "GET ALL PRODUCT SUCCESS",
//                     data: allProductSort,
//                     totalProduct: totalProduct,
//                     pageCurrent: page + 1,
//                     totalPage: Math.ceil(totalProduct / limit),
//                 });
//             }

//             // Nếu limit null => lấy hết
//             if (!limit) {
//                 allProduct = await Product.find();
//             } else {
//                 allProduct = await Product.find()
//                     .limit(limit)
//                     .skip(limit * page);
//             }

//             resolve({
//                 status: "OK",
//                 message: "GET ALL PRODUCT SUCCESS",
//                 data: allProduct,
//                 totalProduct: totalProduct,
//                 pageCurrent: page + 1,
//                 totalPage: Math.ceil(totalProduct / limit),
//             });
//         } catch (e) {
//             reject(e);
//         }
//     });
// };

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            let allProduct = [];
            const totalProduct = await Product.countDocuments();
            if (filter) {
                const label = filter[0];
                const filterValue = filter[1];
                let filterCondition = {};

                // Kiểm tra nếu filter type
                if (label === "type") {
                    filterCondition["type"] = filterValue;
                } else {
                    // Search lowercase and regex
                    filterCondition[label] = {
                        $regex: filterValue,
                        $options: "i",
                    };
                }

                const allObjectFilter = await Product.find(filterCondition)
                    .limit(limit)
                    .skip(limit * page);

                resolve({
                    status: "OK",
                    message: "GET ALL PRODUCT SUCCESS",
                    data: allObjectFilter,
                    totalProduct: totalProduct,
                    pageCurrent: page + 1,
                    totalPage: Math.ceil(totalProduct / limit),
                });
            }

            // Nếu có sort
            if (sort) {
                const objectSort = {};
                objectSort[sort[1]] = sort[0];
                const allProductSort = await Product.find()
                    .limit(limit)
                    .skip(limit * page)
                    .sort(objectSort);
                resolve({
                    status: "OK",
                    message: "GET ALL PRODUCT SUCCESS",
                    data: allProductSort,
                    totalProduct: totalProduct,
                    pageCurrent: page + 1,
                    totalPage: Math.ceil(totalProduct / limit),
                });
            }

            // Nếu không có limit, lấy tất cả sản phẩm
            if (!limit) {
                allProduct = await Product.find();
            } else {
                allProduct = await Product.find()
                    .limit(limit)
                    .skip(limit * page);
            }

            resolve({
                status: "OK",
                message: "GET ALL PRODUCT SUCCESS",
                data: allProduct,
                totalProduct: totalProduct,
                pageCurrent: page + 1,
                totalPage: Math.ceil(totalProduct / limit),
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct("type");

            resolve({
                status: "OK",
                message: "GET ALL PRODUCT SUCCESS",
                data: allType,
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllType,
};
