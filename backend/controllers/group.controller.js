/**
 * Create group ✅
 * Delete group
 * Update group
 * Create invitation link ✅
 * Validate & join user ✅
 * Make the invitation URL shorter
 */

import mongoose from "mongoose";
import Group from "../models/group.model.js";
import Membership from "../models/membership.model.js";
import User from "../models/user.model.js"
import generateToken from "../utils/jwt.js";
import linkValidator from "../middleware/linkValidator.js";

//create group
export const createGroup = async (req, res) => {

    try {
        var session = await mongoose.startSession();
        const { groupName } = req.body;
        const { userId } = req; // comes from auth middleware
        console.log("owner", userId)
        if (!groupName || !groupName.trim()) {
            return res.status(400).json({
                success: false,
                message: "Group name is required"
            });
        }

        const exist = await Group.find({ groupName });
        console.log("group exist", exist.length)
        if (exist.length) {
            return res.status(200).json({ message: `Group with ${groupName} already exist`, success: false });
        }


        session.startTransaction();

        // 1) Create group
        const group = await Group.create([{
            groupName: groupName.trim(),
            owner: userId
        }], { session });
        console.log("group ", group)

        // 2) Add creator as admin in membership
        await Membership.create([{
            user: userId,
            group: group[0]._id,
            role: "admin"
        }], { session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            success: true,
            message: "Group created successfully",
            group
        });

    } catch (error) {
        console.error("error while creating group", error)
        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({
            success: false,
            message: "Failed to create group",
            error: error.message
        });
    }
};


//Generate invitation link
export const generateInvitationLink = async (req, res) => {

    try {

        const { groupName } = req.params
        const { userId } = req;

        //validate group name


        //use groupName to create invitation link in future
        const inivitaionToken = generateToken({ _id: userId });
        const inviteURL = new URL(`/app/card?l=${inivitaionToken}`, "http://localhost:5173");

        return res.status(201).json({
            message: "Invitation link created successfully",
            success: true,
            data: { url: inviteURL, roomId: userId }
        });


    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "Server error",
        });
    }
}

//validate & join
export const joinGroup = async (req, res) => {
    try {

        const { gName, adminID, userId } = req;

        console.log(userId, gName, adminID);
        var session = await mongoose.startSession();

        const exist = await User.findById({ _id: userId });
        console.log(exist)

        if (!exist) {
            return res.status(200).json({ message: "User don't exist" });
        }

        const group = await Group.find({ groupName: gName, owner: adminID });
        console.log("group -->", group)
        if (!group) {
            return res.status(404).json({ message: "NO group exist", success: false });
        }

        session.startTransaction();

        const member = await Membership.create([{
            user: userId,
            group: group[0]._id,
            role: "member"
        }], { session });
        console.log("members -->", member);

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({ message: "group joined successfully", data: member });
    } catch (error) {
        console.error("error", error);
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({
            message: "Server error",
        });
    }
}

export const displayGroups = async (req, res) => {
    try {
        const { userId } = req;

        const groups = await Membership.find({ user: userId }).populate("user"); //display all the groups
        console.log("all groups", groups);
        if (!groups.length) {
            return res.status(404).json({ message: "No groups exist", success: false });
        }

        return res.status(200).json({ message: "data fetched successfully", data: groups });

    } catch (error) {
        console.error("error", error);
        res.status(500).json({
            message: "Server error",
        });
    }
}

export const verifyRoom = async (req, res) => {
    try {
        const { link } = req.params;
        console.log("link --------->",link)
        const roomId = await linkValidator(link);
        if(!roomId){
            return res.status(404).json({message:"unauthorised",sucess:false})
        }
        console.log("room Iddd -->",roomId)
        return res.status(200).json({message:"link verified",data:roomId,success:true});

    } catch (error) {
        console.log("error in link validation",error)
        return res.status(500).json({message:"Server error"});
    }
}