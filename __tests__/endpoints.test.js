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
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("ID out of range");
      });
  });
  it("Returns an error message if the id is not present (Out of range)", () => {
    return request(app)
      .get("/api/reviews/four")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID, Please use a number");
      });
  });
});
