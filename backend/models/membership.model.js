import { Schema, model } from "mongoose";

const membershipSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: "Group",
        required: true,
    },
    role: {
        type: String,
        enum:["admin","member"],
        trim:true,
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
});

membershipSchema.index({ user: 1, group: 1 }, { unique: true });
membershipSchema.index({ group: 1 });
    export default model("Membership", membershipSchema);