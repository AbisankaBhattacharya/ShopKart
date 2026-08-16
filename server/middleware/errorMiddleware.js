import ApiError from "../utils/ApiError.js";

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (error, req, res, next) => {
  const statusCode =
    error.statusCode ||
    (error.name === "ValidationError" ? 400 : error.code === 11000 ? 409 : 500);

  const message =
    error.code === 11000
      ? "An account with this email already exists"
      : error.statusCode || error.name === "ValidationError"
        ? error.message
        : "Internal server error";

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
