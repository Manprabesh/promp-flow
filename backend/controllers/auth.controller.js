import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import generateToken from "../utils/jwt.js";
import jwt from "jsonwebtoken"


export const signUp = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }
        console.log("email -->", email, "password -->", password);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                sucess: false,
                message: "User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            email,
            password: hashedPassword,
        });
        console.log("user id -->", user.email)
        const cookie = generateToken({ id: user._id })

        res.cookie('token', cookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        res.status(201).json({
            success: true,
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

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                sucess: false
            });
        }

        const verified = await bcrypt.compare(password, user.password);

        if (!verified) {
            return res.status(404).json({ success: false, message: "email or password is wrong" })
        }
        else {

            console.log("user id -->", user)
            const cookie = generateToken({ id: user._id })


            res.cookie('token', cookie, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                maxAge: 1000 * 60 * 60 * 24 * 7,
            });

            res.status(200).json({
                sucess: true,
                message: "User loggedin successfully",
                userId: user._id,
            });
        }


    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const OAuthLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "Credential is required",
            });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return res.status(400).json({
                success: false,
                message: "Invalid Google token",
            });
        }

        const { email, email_verified } = payload;

        if (!email || !email_verified) {
            return res.status(400).json({
                success: false,
                message: "Google email not verified",
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
            });
        }

        const token = generateToken({ id: user._id });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        return res.status(200).json({
            success: true,
            message: "Google login successful",
            userId: user._id,
        });

    } catch (error) {
        console.error("Error in OAuth login:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};