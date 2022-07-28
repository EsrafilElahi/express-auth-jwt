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

module.exports = authenticate;
