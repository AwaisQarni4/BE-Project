const express = require("express");
const app = express();

//requiring controller variables
const { getCategories } = require("../controllers/controllers.js");

//endpoints
app.get("/api/categories", getCategories);

//custom error handling

//default SQL error handling using error codes

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
