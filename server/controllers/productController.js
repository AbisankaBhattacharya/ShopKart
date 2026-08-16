import mongoose from "mongoose";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ name: 1 }).lean();

    return res.status(200).json({
      success: true,
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findById(id).lean();

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return res.status(200).json({
      success: true,
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};
