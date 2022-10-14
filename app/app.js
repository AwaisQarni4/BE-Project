const express = require("express");
const app = express();
const {
  getCategories,
  getReviewId,
  getUsers,
  updateReviewVotes,
  getReviews,
  getComments,
  addComment,
  deleteComment,
  getEndpoints,
} = require("../controllers/controllers.js");
const {
  PSQLError,
  customError,
  internalError,
} = require("./error-handling.js");

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewId);
app.get("/api/users", getUsers);
app.patch("/api/reviews/:review_id", updateReviewVotes);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getComments);
app.post("/api/reviews/:review_id/comments", addComment);
app.delete("/api/comments/:comment_id", deleteComment);
app.get("/api", getEndpoints);

app.get("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(PSQLError);

app.use(customError);

app.use(internalError);

module.exports = app;
