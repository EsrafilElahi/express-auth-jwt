const express = require("express");

const router = express.Router();

router.get("/:courseNumber", async (req, res) => {
  res.send(`course route with courseNumber ${req.params.courseNumber}`);
});

module.exports = router;
