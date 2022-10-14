const app = require("../app/app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
require("jest-sorted");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/categoriess", () => {
  it("Returns an error message when endpoint is not found", () => {
    return request(app)
      .get("/api/categoriess")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/categories", () => {
  it("Returns an array of category objects, with slug and description properties", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body).toHaveLength(4);
        body.forEach((category) => {
          expect.objectContaining({
            slug: expect(String),
            description: expect(String),
          });
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  const expectedProperties = [
    "review_id",
    "title",
    "category",
    "designer",
    "owner",
    "review_body",
    "review_img_url",
    "created_at",
    "votes",
    "comment_count",
  ];
  it("Returns a review object, with following properties, review_id, title, review_body, designer, review_img_url, votes, category field , owner and created_at", () => {
    return request(app)
      .get("/api/reviews/4")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.review_id).toBe(4);
        const resultKeys = Object.keys(body);
        expect(resultKeys).toEqual(expectedProperties);
      });
  });
  it("Returns an error message if the id is not present (Out of range)", () => {
    return request(app)
      .get("/api/reviews/4444")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
  it("Returns an error message if the id is not present (Out of range)", () => {
    return request(app)
      .get("/api/reviews/four")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request");
      });
  });
  it("Returns a review object, now with comment-count as well for that review with some comment count", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.review_id).toBe(2);
        expect(body.comment_count).toBe(3);
      });
  });
  it("Returns a review object, now with comment-count as well for that review with zero reviews", () => {
    return request(app)
      .get("/api/reviews/4")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.review_id).toBe(4);
        expect(body.comment_count).toBe(0);
      });
  });
});

describe("GET /api/users", () => {
  it("GET /api/users should return array of objects with the following properties, username, name and avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body).toHaveLength(4);
        body.forEach((user) => {
          expect.objectContaining({
            username: expect(String),
            name: expect(String),
            avatar_url: expect(String),
          });
        });
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  it("PATCH /api/reviews/2 should update the voting count of that review", () => {
    const newVotes = { inc_votes: 4 };
    return request(app)
      .patch("/api/reviews/2")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(9);
      });
  });

  it("PATCH /api/reviews/2 should update the voting count (negative) of that review", () => {
    const otherVotes = { inc_votes: -10 };
    return request(app)
      .patch("/api/reviews/4")
      .send(otherVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(-3);
      });
  });

  it("PATCH /api/reviews/223112 should respond with an error message and 404 error as the id does not exist", () => {
    const otherVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/reviews/223112")
      .send(otherVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });

  it("PATCH /api/reviews/five should respond with an error message and 404 error as the id is not an integer", () => {
    const otherVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/reviews/five")
      .send(otherVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request");
      });
  });

  it("PATCH /api/reviews/5 with number of votes in the wrong format should respond with an error message as number of votes should be integer", () => {
    const otherVotes = { inc_votes: "one" };
    return request(app)
      .patch("/api/reviews/5")
      .send(otherVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request");
      });
  });

  it("PATCH /api/reviews/5 with key other than inc_votes should respond with an error message as number of votes should be integer", () => {
    const otherVotes = { add_votes: 2 };
    return request(app)
      .patch("/api/reviews/5")
      .send(otherVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid update request");
      });
  });
});

describe("GET /api/reviews", () => {
  it("GET /api/reviews responds with an array and following properties, owner, title, review_id, category, review_img_url, created_at, votes, designer and comment_count", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(13);
        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });
  it("GET /api/reviews?cateogry=xyz responds with reviews filtered by cateogry xyz", () => {
    return request(app)
      .get("/api/reviews?category=euro game")
      .expect(200)
      .then(({ body }) => {
        body.forEach((review) => {
          expect(review.category).toBe("euro game");
        });
      });
  });

  it("GET /api/reviews?cateogry=xyz responds with an empty array if category exists but has no reviews", () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(0);
      });
  });

  it("GET /api/reviews?cateogry=xyz responds with a message if category value does not exist", () => {
    return request(app)
      .get("/api/reviews?category=EA Games")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query!");
      });
  });

  it("GET /api/reviewss?cateogryy=xyz responds with a sorted reviews array as the query is not right", () => {
    return request(app)
      .get("/api/reviews?categoryy=euro game")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(13);
        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });

  it("GET /api/reviews?sort_by=xyz responds with reviews sorted by xyz if it exists", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(13);
        expect(body).toBeSortedBy("votes", { descending: true });
      });
  });

  it("GET /api/reviews?sort_by=xyz responds with reviews sorted by xyz if it exists", () => {
    return request(app)
      .get("/api/reviews?sort_by=owner")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(13);
        expect(body).toBeSortedBy("owner", { descending: true });
      });
  });

  it("GET /api/reviews?sort_by=xyz responds with error if xyz does not exists", () => {
    return request(app)
      .get("/api/reviews?sort_by=price")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query");
      });
  });

  it("GET /api/reviews?order=xyz responds with reviews sorted by asc or dsc", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(13);
        expect(body).toBeSortedBy("created_at", { descending: false });
      });
  });

  it("GET /api/reviews?order=xyz responds with error if xyz does not exists", () => {
    return request(app)
      .get("/api/reviews?order=descending")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query");
      });
  });

  it("GET /api/reviews?sorting=xyz responds with the default array wrt sort_by = created at and order = desc", () => {
    return request(app)
      .get("/api/reviews?sorting=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(13);
        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });

  it("GET /api/reviews?sort_by=xyz&order=abc responds with the default array wrt sort_by = xyz and order = abc", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(13);
        expect(body).toBeSortedBy("votes", { descending: false });
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  it("GET /api/reviews/:review_id/comments responds with array of comments for the given review_id with certain properties", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(3);
        body.forEach((comment) => {
          expect.objectContaining({
            comment_id: expect(Number),
            body: expect(String),
            review_id: expect(Number),
            author: expect(String),
            votes: expect(Number),
            created_at: expect(String),
          });
        });
      });
  });

  it("GET /api/reviews/:review_id/comments responds with 200 status and an empty array", () => {
    return request(app)
      .get("/api/reviews/4/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(0);
      });
  });

  it("GET /api/reviews/:review_id/comments responds with 404 status when review id out of range", () => {
    return request(app)
      .get("/api/reviews/4444/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });

  it("GET /api/reviews/:review_id/comments responds with 400 status when review id is not a number", () => {
    return request(app)
      .get("/api/reviews/four/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  it("POST /api/reviews/:review_id/comments can post a comment with the right input", () => {
    const newComment = {
      username: "mallionaire",
      body: "Nice game!",
    };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment_id).toBe(7);
        expect(body.body).toBe(newComment.body);
        expect(body.author).toBe(newComment.username);
        expect(body.votes).toBe(0);
        expect(typeof body.created_at).toBe("string");
      });
  });

  it("POST /api/reviews/:review_id/comments returns error if not provided with the right input", () => {
    const newComment = {
      myname: "mallionaire",
      body: "Nice game!",
    };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Wrong Input");
      });
  });

  it("POST /api/reviews/:review_id/comments returns error if provided with the username that does not exist", () => {
    const newComment = {
      username: "awais",
      body: "Nice game!",
    };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Username not found");
      });
  });

  it("POST /api/reviews/:review_id/comments returns error if review id is not valid", () => {
    const newComment = {
      username: "mallionaire",
      body: "Nice game!",
    };
    return request(app)
      .post("/api/reviews/four/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request");
      });
  });

  it("POST /api/reviews/:review_id/comments returns error if review id not found", () => {
    const newComment = {
      username: "mallionaire",
      body: "Nice game!",
    };
    return request(app)
      .post("/api/reviews/4345/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("Deletes a comment if a valid id is provided", () => {
    return request(app).delete("/api/comments/5").expect(204);
  });

  it("Returns error msg if ID is out of range", () => {
    return request(app)
      .delete("/api/comments/456")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });

  it("Returns error msg if ID is not a number", () => {
    return request(app)
      .delete("/api/comments/one")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Request");
      });
  });
});
