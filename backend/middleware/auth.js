import jwt from "jsonwebtoken";

export default function authenticate(req, res, next) {
  const cookie = req.cookies.token;
  // console.log()

  console.log("headers debuggiing", req.cookies.token);

  if (!cookie) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    console.log('decode',decoded)
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}