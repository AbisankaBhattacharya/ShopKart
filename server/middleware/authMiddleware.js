import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

const protect = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    const [scheme, token] = authorization?.split(" ") || [];

    if (scheme !== "Bearer" || !token) {
      throw new ApiError(401, "Authentication is required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new ApiError(401, "Authentication is required");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Invalid or expired authentication token"));
    }

    next(error);
  }
};

export default protect;
