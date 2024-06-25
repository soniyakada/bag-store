const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("I am Owner of this application");
});

module.exports = router;
