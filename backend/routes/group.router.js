import express from "express"
import authenticate from "../middleware/auth.js"
import linkValidator from "../middleware/linkValidator.js"
import { createGroup, generateInvitationLink, joinGroup, displayGroups,verifyRoom } from "../controllers/group.controller.js";
const groupRouter = express.Router();

groupRouter.post("/create-group",authenticate,createGroup);
groupRouter.get("/generate-link/:groupName",authenticate,generateInvitationLink);
groupRouter.get("/join-group/:link",authenticate,linkValidator,joinGroup);
groupRouter.get("/display-group",authenticate,displayGroups);
groupRouter.get("/verify-link/:link",authenticate,verifyRoom);

export default groupRouter;
