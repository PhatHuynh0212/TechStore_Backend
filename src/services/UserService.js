const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser;
        try {
            const checkUser = await User.findOne({
                email: email,
            });
            if (checkUser !== null) {
                resolve({
                    status: "OK",
                    message: "The email is already exist",
                });
            }

            // Mã hóa password
            const hash = bcrypt.hashSync(password, 10);

            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone,
            });
            if (createdUser) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createdUser,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = userLogin;
        try {
            const checkUser = await User.findOne({
                email: email,
            });

            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: "The user is not defined",
                });
            }
            // so sánh password giữa user nhập và database
            const comparePassword = bcrypt.compareSync(
                password,
                checkUser.password
            );

            if (!comparePassword) {
                resolve({
                    status: "OK",
                    message: "The password or username is incorrect",
                });
            }

            // Access Token
            const access_token = await generalAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            });

            // Refresh Token
            const refresh_token = await generalRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            });

            resolve({
                status: "OK",
                message: "SUCCESS",
                access_token,
                refresh_token,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id,
            });

            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: "The user is not defined",
                });
            }

            const updateUser = await User.findByIdAndUpdate(id, data, {
                new: true,
            });

            resolve({
                status: "OK",
                message: "SUCCESS",
                data: updateUser,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id,
            });

            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: "The user is not defined",
                });
            }

            await User.findByIdAndDelete(id);

            resolve({
                status: "OK",
                message: "DELETE USER SUCCESS",
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find();

            resolve({
                status: "OK",
                message: "GET ALL USER SUCCESS",
                data: allUser,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id,
            });

            if (user === null) {
                resolve({
                    status: "OK",
                    message: "The user is not defined",
                });
            }

            resolve({
                status: "OK",
                message: "SUCCESS",
                data: user,
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
};