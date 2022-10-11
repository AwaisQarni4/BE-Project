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

const patchReviewVotes = (id, voteBody) => {
  if (!voteBody.inc_votes) {
    return Promise.reject({ status: 400, msg: "Invalid update request" });
  }

  const newVotes = voteBody.inc_votes;

  return db
    .query(
      `UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *;`,
      [id, newVotes]
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
