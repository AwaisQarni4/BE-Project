const db = require("../db/connection.js");

const fetchCategories = () => {
  return db.query("SELECT * FROM categories;").then(({ rows }) => {
    return rows;
  });
};

const fetchReviewId = (id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      }
      return rows[0];
    });
};

const fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => rows);
};

module.exports = { fetchCategories, fetchReviewId, fetchUsers };
