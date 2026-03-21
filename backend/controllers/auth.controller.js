import User from "../models/user.model.js";
import bcrypt from "bcrypt";

import generateToken from "../utils/jwt.js";

export const signUp = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            email,
            password: hashedPassword,
        });
        console.log("user id -->",user.email)
        const cookie = generateToken({id:user._id})

        res.cookie("token",cookie);

        res.status(201).json({
            message: "User created successfully",
            userId: user._id,
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            message: "Server error",
        });
    }
}