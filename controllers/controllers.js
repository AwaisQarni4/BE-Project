const { fetchCategories } = require("../models/models.js");

const getCategories = (req, res) => {
  fetchCategories()
    .then((categories) => {
      res.status(200).send(categories);
    })
    .catch((err) => next(err));
};

module.exports = { getCategories };
