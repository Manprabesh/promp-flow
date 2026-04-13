import express from "express";
import { signUp,login,OAuthLogin,checkAuth } from "../controllers/auth.controller.js";
import authenticate from "../middleware/auth.js";
const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.post("/oauth", OAuthLogin);
authRouter.get("/check-auth",authenticate,checkAuth)

export default authRouter;