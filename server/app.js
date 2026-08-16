import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ShopKart API Running",
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
