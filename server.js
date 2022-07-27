const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const handleErrors = require("./middlewares/handleErrors");
const setHeadersOrigin = require("./middlewares/setHeadersOrigin");
const mongoose = require("mongoose");
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const connectDB = require("./database/db");
dotenv.config();

const app = express();
const PORT = process.env.PROJECT_PORT || 5050;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: `http://localhost:${PORT}` }));
app.use(handleErrors);
app.use(setHeadersOrigin);
app.use("/api/auth/register", registerRoute);
app.use("/api/auth/login", loginRoute);

// routes
app.get("/", (req, res) => {
  res.send("welcom to home page");
});

app.get("*", (req, res) => {
  res.send("404 not found");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`server running on port ${PORT}`);
});
