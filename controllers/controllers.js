const {
  fetchCategories,
  fetchReviewId,
  fetchUsers,
  patchReviewVotes,
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
  const voteBody = req.body;
  const id = req.params.review_id;
  patchReviewVotes(id, voteBody)
    .then((updatedReview) => {
      res.status(200).send(updatedReview);
    })
    .catch(next);
};

module.exports = { getCategories, getReviewId, getUsers, updateReviewVotes };
