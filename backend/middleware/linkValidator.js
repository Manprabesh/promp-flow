import jwt from "jsonwebtoken";

const   linkValidator = async (roomId) => {
    try {
        const token = roomId
        console.log("inivite link",token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("decoded",decoded)
        return decoded._id

    } catch (error) {
        console.error("error",error);
        return false
    }
}

export default linkValidator