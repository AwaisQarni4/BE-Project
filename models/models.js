const db = require("../db/connection.js");

const fetchCategories = () => {
  return db.query("SELECT * FROM categories;").then(({ rows }) => {
    return rows;
  });
};

const fetchReviewId = (id) => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.comment_id) ::INT AS comment_count
      FROM reviews 
      LEFT JOIN comments 
      ON reviews.review_id = comments.review_id 
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id;`,
      [id]
    )
    .then(({ rows }) => {
      console.log(rows);
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      }
      return rows[0];
    });
};

const fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => rows);
};

const patchReviewVotes = (id, votes) => {
  if (!votes) {
    return Promise.reject({ status: 400, msg: "Invalid update request" });
  }

  return db
    .query(
      `UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *;`,
      [id, votes]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Invalid ID" });
      }
      return rows[0];
    });
};

module.exports = {
  fetchCategories,
  fetchReviewId,
  fetchUsers,
  patchReviewVotes,
};
