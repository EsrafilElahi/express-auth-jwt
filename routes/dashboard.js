const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("dashboard route");
});

module.exports = router;
