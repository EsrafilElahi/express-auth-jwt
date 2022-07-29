const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  const token = req.header("Auth-Token");
  if (!token) {
    res.status(401).send("not authorization");
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    res.user = verified;
    next();
  } catch (error) {
    res.status(400).send("invalid token");
  }
};

const authDashboard = (permissionsRoles) => {
  return async (req, res, next) => {
    if (permissionsRoles.includes(req.body.role)) {
      next();
    }
    res.status(401).send("not auth role");
  };
};

const authCourses = async (req, res, next) => {
  if (req.body.courses.includes(parsInt(req.params.courseNumber))) {
    next();
  }
  res.status(401).send("not auth role");
};

module.exports = { authenticate, authDashboard, authCourses };
