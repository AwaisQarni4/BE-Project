const express = require("express");
const app = express();
const {
  getCategories,
  getReviewId,
  getUsers,
} = require("../controllers/controllers.js");
const {
  PSQLError,
  customError,
  internalError,
} = require("./error-handling.js");

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewId);
app.get("/api/users", getUsers);

app.get("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(PSQLError);

app.use(customError);

app.use(internalError);

module.exports = app;
