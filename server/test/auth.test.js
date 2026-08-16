import assert from "node:assert/strict";
import { after, afterEach, before, test } from "node:test";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const TEST_JWT_SECRET = "test-only-jwt-secret";
const TEST_PASSWORD = "SecurePassword123!";

let app;
let User;
let protect;
let mongoServer;
let server;
let baseUrl;

const request = async (path, { method = "GET", body, headers = {} } = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  return {
    status: response.status,
    body: await response.json(),
  };
};

const registerUser = (overrides = {}) =>
  request("/api/auth/register", {
    method: "POST",
    body: {
      name: "Test User",
      email: "test@example.com",
      password: TEST_PASSWORD,
      ...overrides,
    },
  });

const runProtect = (authorization) =>
  new Promise((resolve) => {
    const req = {
      headers: authorization === undefined ? {} : { authorization },
    };

    protect(req, {}, (error) => resolve({ error, user: req.user }));
  });

before(async () => {
  process.env.JWT_SECRET = TEST_JWT_SECRET;
  process.env.JWT_EXPIRES_IN = "1h";
  process.env.CLIENT_URL = "http://localhost:5173";

  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  ({ default: app } = await import("../app.js"));
  ({ default: User } = await import("../models/User.js"));
  ({ default: protect } = await import("../middleware/authMiddleware.js"));

  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

afterEach(async () => {
  await User.deleteMany({});
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

test("registers a user and returns a JWT without password data", async () => {
  const response = await registerUser();

  assert.equal(response.status, 201);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.user.name, "Test User");
  assert.equal(response.body.data.user.email, "test@example.com");
  assert.equal(typeof response.body.data.token, "string");
  assert.equal(jwt.verify(response.body.data.token, TEST_JWT_SECRET).userId, response.body.data.user.id);
  assert.doesNotMatch(JSON.stringify(response.body), /password/i);
});

test("rejects registration without a name", async () => {
  const response = await registerUser({ name: undefined });

  assert.equal(response.status, 400);
  assert.match(response.body.message, /name/i);
});

test("rejects registration without an email", async () => {
  const response = await registerUser({ email: undefined });

  assert.equal(response.status, 400);
  assert.match(response.body.message, /email/i);
});

test("rejects registration without a password", async () => {
  const response = await registerUser({ password: undefined });

  assert.equal(response.status, 400);
  assert.match(response.body.message, /password/i);
});

test("rejects registration with a password shorter than 8 characters", async () => {
  const response = await registerUser({ password: "short" });

  assert.equal(response.status, 400);
  assert.match(response.body.message, /8 characters/i);
});

test("rejects duplicate registration emails", async () => {
  await registerUser();
  const response = await registerUser();

  assert.equal(response.status, 409);
  assert.match(response.body.message, /already exists/i);
});

test("stores a bcrypt password hash instead of the registration password", async () => {
  await registerUser();
  const user = await User.findOne({ email: "test@example.com" }).select("+password");

  assert.notEqual(user.password, TEST_PASSWORD);
  assert.equal(await bcrypt.compare(TEST_PASSWORD, user.password), true);
});

test("logs in with valid credentials and returns a JWT without password data", async () => {
  await registerUser();
  const response = await request("/api/auth/login", {
    method: "POST",
    body: { email: "test@example.com", password: TEST_PASSWORD },
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(typeof response.body.data.token, "string");
  assert.equal(jwt.verify(response.body.data.token, TEST_JWT_SECRET).userId, response.body.data.user.id);
  assert.doesNotMatch(JSON.stringify(response.body), /password/i);
});

test("rejects login with missing credentials", async () => {
  const response = await request("/api/auth/login", {
    method: "POST",
    body: { email: "test@example.com" },
  });

  assert.equal(response.status, 400);
  assert.match(response.body.message, /required/i);
});

test("rejects login with an incorrect email", async () => {
  await registerUser();
  const response = await request("/api/auth/login", {
    method: "POST",
    body: { email: "unknown@example.com", password: TEST_PASSWORD },
  });

  assert.equal(response.status, 401);
  assert.equal(response.body.message, "Invalid email or password");
});

test("rejects login with an incorrect password", async () => {
  await registerUser();
  const response = await request("/api/auth/login", {
    method: "POST",
    body: { email: "test@example.com", password: "IncorrectPassword123!" },
  });

  assert.equal(response.status, 401);
  assert.equal(response.body.message, "Invalid email or password");
});

test("authentication middleware rejects a missing Authorization header", async () => {
  const { error } = await runProtect();

  assert.equal(error.statusCode, 401);
  assert.match(error.message, /authentication is required/i);
});

test("authentication middleware rejects a malformed Bearer token", async () => {
  const { error } = await runProtect("Bearer ");

  assert.equal(error.statusCode, 401);
});

test("authentication middleware rejects an invalid JWT", async () => {
  const { error } = await runProtect("Bearer not-a-jwt");

  assert.equal(error.statusCode, 401);
  assert.match(error.message, /invalid or expired/i);
});

test("authentication middleware rejects an expired JWT", async () => {
  const expiredToken = jwt.sign({ userId: new mongoose.Types.ObjectId() }, TEST_JWT_SECRET, {
    expiresIn: "-1s",
  });
  const { error } = await runProtect(`Bearer ${expiredToken}`);

  assert.equal(error.statusCode, 401);
  assert.match(error.message, /invalid or expired/i);
});

test("authentication middleware identifies the user from a valid JWT", async () => {
  const password = await bcrypt.hash(TEST_PASSWORD, 12);
  const user = await User.create({
    name: "Protected User",
    email: "protected@example.com",
    password,
  });
  const token = jwt.sign({ userId: user._id }, TEST_JWT_SECRET, { expiresIn: "1h" });
  const { error, user: authenticatedUser } = await runProtect(`Bearer ${token}`);

  assert.equal(error, undefined);
  assert.equal(authenticatedUser.id, user.id);
  assert.equal(authenticatedUser.email, "protected@example.com");
});
