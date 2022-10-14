const { disable } = require("../app/app.js");
const db = require("../db/connection.js");
const { includes } = require("../db/data/test-data/categories.js");

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

const fetchReviews = (
  categoryNeeded,
  sortQuery = "created_at",
  orderQuery = "DESC"
) => {
  orderQuery = orderQuery.toUpperCase();

  const validSorts = [
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "created_at",
    "votes",
  ];
  const validOrder = ["ASC", "DESC"];

  if (!validSorts.includes(sortQuery) || !validOrder.includes(orderQuery)) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }

  const queryVals = [];
  let basicQuery = `SELECT reviews.review_id, title, designer, review_img_url, reviews.votes, category, owner, reviews.created_at, COUNT(comments.comment_id) AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON reviews.review_id = comments.review_id`;

  if (categoryNeeded) {
    basicQuery += ` WHERE category = $1`;
    queryVals.push(categoryNeeded);
  }

  basicQuery += ` GROUP BY reviews.review_id ORDER BY ${sortQuery} ${orderQuery};`;

  let categories = [];

  return db
    .query(`SELECT slug FROM categories;`)
    .then(({ rows }) => {
      rows.forEach((row) => categories.push(row.slug));
      const uniqueCategories = [...new Set(categories)];
      return uniqueCategories;
    })
    .then((uniqueCategories) => {
      if (
        categoryNeeded != undefined &&
        !uniqueCategories.includes(categoryNeeded)
      ) {
        return Promise.reject({ status: 400, msg: "Invalid query!" });
      }
      return db.query(basicQuery, queryVals).then(({ rows }) => rows);
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
