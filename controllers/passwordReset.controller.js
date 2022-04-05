import cryptoJs from "crypto-js";
import { TokenModel } from "../model/token.model";
import { UserModel } from "../model/user.model"
import ResetMail from "../utils/reset.mail";
import mongoose from 'mongoose'

// var data = JSON.stringify({ abc: 'xyz' });

export const PasswordResetLink = async (req, res) => {
    try {
        if (!req.body.email) {
            return res.status(402).json({ message: "Email is required." });
        }

        UserModel.findOne({ email: req.body.email })
            .exec((err, user) => {
                if (err) {
                    return res.send(err);
                }

                if (!user) {
                    return res.json({ message: "Email does not exists", status: 404 });
                }

                TokenModel.findOne({ userId: user._id })
                    .exec((error, token) => {
                        if (error) {
                            return res.send(error);
                        }

                        if (!token) {
                            let newToken = new TokenModel({
                                userId: user._id,
                                token: Math.random(),
                            });

                            newToken.save((error, saveToken) => {
                                if (error) {
                                    return res.send(error);
                                }

                                const link = `${process.env.MAIL_BASE_URL}/password-reset/${user._id}/${saveToken.token}`;

                                ResetMail(user.email, "Password Reset", link);

                                return res.send({ message: "Password reset link sent to your mail account" });
                            });
                        } else {
                            const link = `${process.env.MAIL_BASE_URL}/password-reset/${user._id}/${token.token}`;

                            ResetMail(user.email, "Password Reset", link)
                                .then((res) => {
                                    console.log(res);
                                });

                            return res.send({ message: "Password reset link sent to your mail account" });
                        }
                    });
            });
    } catch (error) {
        return res.send(error);
    }
}

export const PasswordResetToken = async (req, res) => {
    try {
        if (!req.body.password) {
            return res.send(`Please, Enter a password`);
        }

        await UserModel.findOne({ _id: req.params.userId }).exec((err, user) => {
            if (err) {
                if (err.name == "CastError" && err.valueType == "string") {
                    return res.json({ message: "Invalid link " });
                }
                return res.send(err);
            }

            if (!user) {
                return res.json({ message: "Invalid link " });
            }

            TokenModel.findOne({ $and: [{ userId: user._id }, { token: req.params.token }] }).exec((error, token) => {
                if (error) {
                    return res.send(error);
                }

                if (!token) {
                    return res.json({ message: "Invalid link " });
                }

                user.password = req.body.password;

                user.save((err) => {
                    if (err) {
                        return res.send(err);
                    }

                    TokenModel.deleteOne({ id: token._id }, (error) => {
                        if (error) {
                            return res.send(error);
                        }

                        return res.json({ message: "Password is successfully reset" });
                    });
                });
            });
        });

    } catch (error) {
        return res.send(error);
    }
} 