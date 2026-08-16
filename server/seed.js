import dotenv from "dotenv";
import mongoose from "mongoose";
import products from "./data/products.js";
import Product from "./models/Product.js";

dotenv.config();

const seedProducts = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is required to seed products");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const result = await Product.bulkWrite(
      products.map((product) => ({
        updateOne: {
          filter: { name: product.name, category: product.category },
          update: { $setOnInsert: product },
          upsert: true,
        },
      }))
    );

    console.log(`Product seed completed: ${result.upsertedCount} product(s) inserted.`);
  } catch (error) {
    console.error("Product seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedProducts();
