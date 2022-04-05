import bcryptjs from "bcryptjs";
import { UserModel } from "../model/user.model";

const salt = bcryptjs.genSaltSync(8);

export const creatUser = (req, res) => {
    const newUser = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password !== undefined ? bcryptjs.hashSync(req.body.password, salt) : req.body.password,
    });

    newUser.save((error, user) => {
        if (error) {
            return res.send(error);
        }

        return res.send(user);
    });
}

