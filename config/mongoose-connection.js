const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/scatch")
  .then(() => {
    console.log("Connected to Mongodb");
  })
  .catch((err) => {
    console.log("error", err);
  });

module.exports = mongoose.connection;
