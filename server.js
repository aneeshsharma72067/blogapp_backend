const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const blogs = require("./routes/api/blogs");
const auth = require("./routes/api/auth");
const users = require("./routes/api/users");

// .env file setup
dotenv.config({ path: ".env" });
const port = process.env.PORT;
// creating express app
const app = express();

// middlewares
app.use(cors({ origin: true, credentials: true }));
app.use("/uploads", express.static("uploads"));

// connect to DB
connectDB();

// Init middleware
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    msg: "server started",
    url: `http://localhost:${port}`,
  });
});

// user routes
app.use("/api/blogs", blogs);
app.use("/api/auth", auth);
app.use("/api/users", users);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
