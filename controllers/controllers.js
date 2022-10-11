const {
  fetchCategories,
  fetchReviewId,
  fetchUsers,
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

const getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send(users);
  });
};

module.exports = { getCategories, getReviewId, getUsers };
