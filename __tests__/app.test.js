const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("unavailable path", () => {
  test("status 404: should return an error with msg, given a path that is not a valid endpoint", () => {
    return request(app)
      .get("/not-a-path")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("path not found");
      });
  });
});

describe("/api/topics", () => {
  describe("GET", () => {
    test("status 200: should return an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
          });
        });
    });
  });
});

describe("/api", () => {
  describe("GET", () => {
    test("status 200: should return an object detailing all available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(typeof endpoints).toBe("object");
          expect(Array.isArray(endpoints)).not.toBe(true);
          for (const key in endpoints) {
            const endpoint = endpoints[key];
            expect(typeof endpoint.description).toBe("string");
            expect(Array.isArray(endpoint.queries)).toBe(true);
            expect(typeof endpoint.exampleResponse).toBe("object");
          }
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("status: 200, should return an article object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.author).toBe("butter_bridge");
          expect(article.title).toBe("Living in the shadow of a great man");
          expect(article.article_id).toBe(1);
          expect(article.body).toBe("I find this existence challenging");
          expect(article.topic).toBe("mitch");
          expect(typeof article.created_at).toBe('string');
          expect(article.votes).toBe(100);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test('status: 404, should return error message when given a valid but non-existent id', () => {
        return request(app).get("/api/articles/1000").expect(404).then(({body:{msg}})=>{
            expect(msg).toBe("article does not exist");
        })
    });
    test('status: 400, should return error message when given an invalid id', () => {
        return request(app).get("/api/articles/not-a-id").expect(400).then(({body:{msg}})=>{
            expect(msg).toBe("bad request");
        })
    });
  });
});
