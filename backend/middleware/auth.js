import jwt from "jsonwebtoken";


export const verifyToken = (req, res, next) => {
  try {
    console.log("verify token")
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    );

    // 🔥 Important Fix
    req.user = {
      id: decoded.id || decoded._id
    };

    next();
  } catch (error) {
    console.error("Token Error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
