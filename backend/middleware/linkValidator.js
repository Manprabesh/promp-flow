import jwt from "jsonwebtoken";

const   linkValidator = async (req, res, next) => {
    try {
        const token = req.params.link;
        console.log("inivite link",token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.adminID = decoded._id;
        req.gName = decoded.gn;
        console.log("decoded data -> ", decoded)
        next();

    } catch (error) {
        console.error("error",error);
    }
}

export default linkValidator