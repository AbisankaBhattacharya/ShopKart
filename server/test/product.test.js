import assert from "node:assert/strict";
import { after, afterEach, before, test } from "node:test";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let app;
let Product;
let mongoServer;
let server;
let baseUrl;

const productData = {
  name: "Test Phone",
  description: "A product used only for isolated Product API integration tests.",
  price: 49999,
  image: "https://example.com/test-phone.jpg",
  category: "Smartphones",
  stock: 10,
  rating: 4.5,
};

const request = async (path) => {
  const response = await fetch(`${baseUrl}${path}`);

  return {
    status: response.status,
    body: await response.json(),
  };
};

before(async () => {
  process.env.JWT_SECRET = "test-only-jwt-secret";
  process.env.CLIENT_URL = "http://localhost:5173";

  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  ({ default: app } = await import("../app.js"));
  ({ default: Product } = await import("../models/Product.js"));

  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

afterEach(async () => {
  await Product.deleteMany({});
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }
});

test("returns an empty product collection", async () => {
  const response = await request("/api/products");

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.deepEqual(response.body.data.products, []);
});

test("returns products from the database", async () => {
  await Product.create([productData, { ...productData, name: "Test Laptop", category: "Laptops" }]);

  const response = await request("/api/products");

  assert.equal(response.status, 200);
  assert.equal(response.body.data.products.length, 2);
  assert.equal(response.body.data.products[0].name, "Test Laptop");
});

test("returns one product by a valid ID", async () => {
  const product = await Product.create(productData);
  const response = await request(`/api/products/${product.id}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.data.product._id, product.id);
  assert.equal(response.body.data.product.name, productData.name);
});

test("returns 404 when the product does not exist", async () => {
  const response = await request(`/api/products/${new mongoose.Types.ObjectId()}`);

  assert.equal(response.status, 404);
  assert.equal(response.body.message, "Product not found");
});

test("returns 400 for an invalid product ID", async () => {
  const response = await request("/api/products/not-a-valid-id");

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Invalid product ID");
});
