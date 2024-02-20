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
        expect(msg).toBe("404: path not found");
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
          expect(typeof article.created_at).toBe("string");
          expect(article.votes).toBe(100);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test("status: 404, should return error message when given a valid but non-existent id", () => {
      return request(app)
        .get("/api/articles/1000")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("404: article does not exist");
        });
    });
    test("status: 400, should return error message when given an invalid id", () => {
      return request(app)
        .get("/api/articles/not-an-id")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("400: bad request");
        });
    });
  });

  describe("PATCH", () => {
    test("status: 200, should respond with the updated article", () => {
      const patchData = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(patchData)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.author).toBe("butter_bridge");
          expect(article.title).toBe("Living in the shadow of a great man");
          expect(article.article_id).toBe(1);
          expect(article.body).toBe("I find this existence challenging");
          expect(article.topic).toBe("mitch");
          expect(typeof article.created_at).toBe("string");
          expect(article.votes).toBe(101);
          expect(article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test('status: 404, should return an error message when given a valid but non-existent article id', () => {
        const patchData = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1000")
        .send(patchData)
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("404: article does not exist");
          });
    });
    test('status: 400, should return error message when given an invalid article id', () => {
        const patchData = { inc_votes: 1 };
        return request(app)
        .patch("/api/articles/not-an-id")
        .send(patchData)
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("400: bad request");
          });
    });
    test('status: 400, should return error message when the value of inc_votes is invalid', () => {
        const patchData = { inc_votes: 'invalid value' };
        return request(app)
        .patch("/api/articles/1")
        .send(patchData)
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("400: bad request");
          });
    });
    test('status: 422, should return error message if not given inc_votes', () => {
        const patchData = {};
        return request(app)
        .patch("/api/articles/1")
        .send(patchData)
        .expect(422)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("422: required data missing");
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("status: 200, should return an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(5);
          articles.forEach((article) => {
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("number");
            expect(article.body).toBe(undefined);
          });
        });
    });
    test("should be sorted by default in descending order by date", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("status: 200, should return all comments for the given article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(11);
          comments.forEach((comment) => {
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.created_at).toBe("string");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.body).toBe("string");
            expect(typeof comment.article_id).toBe("number");
          });
        });
    });
    test("should be sorted by default in descending order by the created_at values", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("status: 404, should return error message when given a valid but non-existent article id", () => {
      return request(app)
        .get("/api/articles/1000/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("404: article does not exist");
        });
    });
    test("status: 400, should return error message when given an invalid article id", () => {
      return request(app)
        .get("/api/articles/not-an-id/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("400: bad request");
        });
    });
    test("status: 200, should return 200 status code when given an article id that exists but has no associated comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(0);
        });
    });
  });

  describe("POST", () => {
    test("status: 201, should add a comment for a given article", () => {
      const newComment = {
        body: "post new comment test",
        username: "butter_bridge",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment.body).toBe("post new comment test");
          expect(comment.author).toBe("butter_bridge");
          expect(comment.votes).toBe(0);
          expect(comment.article_id).toBe(1);
          expect(comment.comment_id).toBe(19);
          expect(typeof comment.created_at).toBe("string");
        });
    });
    test("status: 404, should return error message when given a valid but non-existent article id", () => {
      const newComment = {
        body: "post new comment test",
        username: "butter_bridge",
      };
      return request(app)
        .post("/api/articles/1000/comments")
        .send(newComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("404: article does not exist");
        });
    });
    test("status: 400, should return error message when given an invalid article id", () => {
      const newComment = {
        body: "post new comment test",
        username: "butter_bridge",
      };
      return request(app)
        .post("/api/articles/not-an-id/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("400: bad request");
        });
    });
    test("status: 400, should return error message when there is details/data missing from the comment being posted", () => {
      const newComment = {};
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(422)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("422: required data missing");
        });
    });
    test("status: 422, username does not belong to a registered user", () => {
      const newComment = {
        body: "post new comment test",
        username: "test_user",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(422)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            "422: username does not belong to a registered user"
          );
        });
    });
  });
});

describe('/api/comments/:comment_id', () => {
    describe('DELETE', () => {
        test('status: 204, deletes the specified comment and returns no response body back', () => {
            return request(app).delete('/api/comments/1').expect(204);
        });
        test('status: 400, returns error message if given an invalid comment_id', () => {
            return request(app).delete('/api/comments/not-an-id').expect(400).then(({body:{msg}})=>{
                expect(msg).toBe('400: bad request')
            });
        });
        test('status: 404, returns error message when given a valid but non-existent comment id', () => {
            return request(app).delete('/api/comments/1000').expect(404).then(({body:{msg}})=>{
                expect(msg).toBe('404: comment does not exist')
            });
        });
    });
});