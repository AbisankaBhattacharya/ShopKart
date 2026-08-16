import jwt from "jsonwebtoken";
import ApiError from "./ApiError.js";

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, "JWT configuration is unavailable");
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

export default generateToken;
