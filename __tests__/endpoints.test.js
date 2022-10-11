const app = require("../app/app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");

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
    // const otherVotes = { inc_votes: -10 };
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
