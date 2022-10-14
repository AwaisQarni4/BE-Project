const {
  fetchCategories,
  fetchReviewId,
  fetchUsers,
  patchReviewVotes,
  fetchReviews,
  fetchComments,
  postComment,
  removeComment,
} = require("../models/models.js");

const endpoints = require("../endpoints.json");

const getEndpoints = (req, res, next) => {
  res.status(200).send(endpoints);
};

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
  const sortQuery = req.query.sort_by;
  const orderQuery = req.query.order;

  fetchReviews(categoryNeeded, sortQuery, orderQuery)
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

const addComment = (req, res, next) => {
  const id = req.params.review_id;
  const { username, body } = req.body;
  fetchReviewId(id)
    .then(() => {
      return postComment(id, username, body);
    })
    .then((comment) => res.status(201).send(comment))
    .catch(next);
};

const deleteComment = (req, res, next) => {
  const id = req.params.comment_id;
  removeComment(id)
    .then(() => {
      res.sendStatus(204);
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
  addComment,
  deleteComment,
  getEndpoints,
};
