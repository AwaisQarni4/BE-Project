const db = require("../db/connection.js");

const fetchCategories = () => {
  return db.query("SELECT * FROM categories").then(({ rows }) => {
    return rows;
  });
};

const fetchReviewId = (id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 400, msg: "ID out of range" });
      }
      return rows[0];
    });
};

module.exports = { fetchCategories, fetchReviewId };
