const { disable } = require("../app/app.js");
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

const fetchReviews = (categoryNeeded) => {
  const basicQuery = `SELECT reviews.review_id, title, designer, review_img_url, reviews.votes, category, owner, reviews.created_at, COUNT(comments.comment_id) AS comment_count
  FROM reviews 
  LEFT JOIN comments 
  ON reviews.review_id = comments.review_id`;

  const categoryQuery = ` WHERE category = $1`;

  const groupQuery = ` GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC;`;

  if (categoryNeeded === undefined) {
    return db.query(basicQuery + groupQuery).then(({ rows }) => {
      return rows;
    });
  }

  let categories = [];

  return db
    .query(`SELECT category FROM reviews;`)
    .then(({ rows }) => {
      rows.forEach((row) => categories.push(row.category));
      const uniqueCategories = [...new Set(categories)];
      return uniqueCategories;
    })
    .then((uniqueCategories) => {
      if (!uniqueCategories.includes(categoryNeeded)) {
        return Promise.reject({ status: 400, msg: "Invalid query!" });
      }
      return db
        .query(basicQuery + categoryQuery + groupQuery, [categoryNeeded])
        .then(({ rows }) => rows);
    });
};

const fetchComments = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE review_id = $1`, [id])
    .then(({ rows }) => {
      return rows;
    });
};

const postComment = (id, username, body) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Wrong Input" });
  }

  return db
    .query(`SELECT username FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 400, msg: "Username not found" });
      }
      return db
        .query(
          `INSERT INTO comments (body, author, review_id) 
      VALUES ($1, $2, $3) RETURNING *;`,
          [body, username, id]
        )
        .then(({ rows }) => rows[0]);
    });
};

const removeComment = (id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Invalid ID" });
      }
    });
};

module.exports = {
  fetchCategories,
  fetchReviewId,
  fetchUsers,
  patchReviewVotes,
  fetchReviews,
  fetchComments,
  postComment,
  removeComment,
};
