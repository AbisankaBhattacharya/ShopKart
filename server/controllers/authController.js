import bcrypt from "bcryptjs";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

const toUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

const validateRegistrationInput = ({ name, email, password }) => {
  if (typeof name !== "string" || name.trim().length < 2) {
    return "Name must be at least 2 characters long";
  }

  if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
    return "A valid email address is required";
  }

  if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`;
  }

  return null;
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const validationError = validateRegistrationInput({ name, email, password });

    if (validationError) {
      throw new ApiError(400, validationError);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      throw new ApiError(409, "An account with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: toUserResponse(user),
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
      "+password"
    );

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ApiError(401, "Invalid email or password");
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: toUserResponse(user),
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};
