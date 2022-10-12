const {
  fetchCategories,
  fetchReviewId,
  fetchUsers,
  patchReviewVotes,
  fetchReviews,
  fetchComments,
} = require("../models/models.js");

const getCategories = (req, res, next) => {
  fetchCategories()
    .then((categories) => {
      res.status(200).send(categories);
    })
    .catch(next);
};

const getReviewId = (req, res, next) => {
  const id = req.params.review_id;
  fetchReviewId(id)
    .then((review) => {
      res.status(200).send(review);
    })
    .catch(next);
};

const getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.status(200).send(users);
  });
};

const updateReviewVotes = (req, res, next) => {
  const votes = req.body.inc_votes;
  const id = req.params.review_id;
  patchReviewVotes(id, votes)
    .then((updatedReview) => {
      res.status(200).send(updatedReview);
    })
    .catch(next);
};

const getReviews = (req, res, next) => {
  const categoryNeeded = req.query.category;
  fetchReviews(categoryNeeded)
    .then((reviews) => {
      res.status(200).send(reviews);
    })
    .catch(next);
};

const getComments = (req, res, next) => {
  const id = req.params.review_id;
  fetchReviewId(id)
    .then(() => {
      fetchComments(id).then((comments) => {
        res.status(200).send(comments);
      });
    })
    .catch(next);
};

module.exports = {
  getCategories,
  getReviewId,
  getUsers,
  updateReviewVotes,
  getReviews,
  getComments,
};
