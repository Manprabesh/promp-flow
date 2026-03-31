import { Schema, model } from "mongoose";

const groupSchema = new Schema({
    groupName: {
        type: String,
        trim:true,
        lowercase:true,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });


export default model("Group", groupSchema);