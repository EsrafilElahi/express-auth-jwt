const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const handleErrors = require("./middlewares/handleErrors");
const setHeadersOrigin = require("./middlewares/setHeadersOrigin");
const connectDB = require("./database/db");
const authRoute = require("./routes/user");
const postsRoute = require("./routes/posts");
const dashboardRoute = require("./routes/dashboard");
const coursesRoute = require("./routes/courses");
const {
  authenticate,
  authDashboard,
  authCourses,
} = require("./middlewares/authenticate");
dotenv.config();

const app = express();
const PORT = process.env.PROJECT_PORT || 5050;


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: `http://localhost:${PORT}` }));
app.use(setHeadersOrigin);
app.use(handleErrors);
app.use("/api/auth", authRoute);
app.use("/posts", authenticate, postsRoute);
app.use("/courses", authenticate, authCourses, coursesRoute);
app.use(
  "/dashboard",
  authenticate,
  authDashboard(["teacher", "admin"]),
  dashboardRoute
);

// routes
app.get("/", (req, res) => {
  res.send("welcom to home page");
});

app.get("*", (req, res) => {
  res.send("404 not found");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
