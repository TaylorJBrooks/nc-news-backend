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

describe('/api/topics/:topic_name', () => {
    describe('GET', () => {
        test('status: 200, returns a topic object', () => {
            return request(app).get('/api/topics/mitch').expect(200).then(({body:{topic}})=>{
                expect(topic.slug).toBe('mitch')
                expect(topic.description).toBe('The man, the Mitch, the legend')
            })
        });
        test('status: 404, returns an error message when given a non-existent topic_name', () => {
            return request(app).get('/api/topics/not-an-existing-topic').expect(404).then(({body:{msg}})=>{
                expect(msg).toBe('404: topic does not exist')
            })
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
            expect(articles.length).toBe(13);
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
      test("should be sorted by default in descending order by created_at date", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      describe('topic query', () => {
          test('status: 200, given a topic query should return articles of only that given topic', ()=>{
              return request(app).get('/api/articles?topic=cats').expect(200).then(({body:{articles}})=>{
                  expect(articles.length).toBe(1)
                  articles.forEach((article)=>{
                      expect(article.topic).toBe('cats');
                  })
              })
          });
          test('status: 404, should return error message given a topic value that is not in the database', () => {
              return request(app).get('/api/articles?topic=not-an-existing-topic').expect(404).then(({body:{msg}})=>{
                  expect(msg).toBe('404: topic does not exist')
              })
          });
          test('status: 200, should return an empty array if the topic exists in the database but has no associated articles', () => {
              return request(app).get('/api/articles?topic=paper').expect(200).then(({body:{articles}})=>{
                  expect(articles.length).toBe(0);
              })
          });
      });
      describe('sort_by query', () => {
          test('status: 200, should be able to be sorted by any valid given column, descending is default', () => {
              return request(app).get("/api/articles?sort_by=title")
              .expect(200).then(({body:{articles}})=>{
                  expect(articles).toBeSortedBy('title', {descending:true})
              })
          });
          test('status: 400, should return error message when given a sort_by value that is not greenlisted', () => {
              return request(app).get("/api/articles?sort_by=not-valid-value")
              .expect(400).then(({body:{msg}})=>{
                  expect(msg).toBe('400: bad request');
              })
          });
      });
  
      describe('order query', () => {
          test('status: 200, should be able to take an order query of asc/desc (desc is default), sort_by is set to created_at by default', () => {
              return request(app).get("/api/articles?order=asc")
              .expect(200).then(({body:{articles}})=>{
                  expect(articles).toBeSortedBy('created_at', {descending:false})
              })
          });
          test('status: 400, should return error message when given an order value that is not greenlisted', () => {
              return request(app).get("/api/articles?order=not-valid-value")
              .expect(400).then(({body:{msg}})=>{
                  expect(msg).toBe('400: bad request')
              })
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
    test('status: 200, the article object should also include a comment_count property', () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body:{article}})=>{
            expect(article.comment_count).toBe(11)
        })
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
    test("status: 422, should return error message when there is details/data missing from the comment being posted", () => {
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

describe('/api/users', () => {
    describe('GET', () => {
        test('status: 200, should return an array of all user objects', () => {
            return request(app).get('/api/users').expect(200).then(({body:{users}})=>{
                expect(users.length).toBe(4)
                users.forEach((user)=>{
                    expect(typeof user.username).toBe('string')
                    expect(typeof user.name).toBe('string')
                    expect(typeof user.avatar_url).toBe('string')
                })
            })
        });
    });
});

describe('/api/users/:username', () => {
    describe('GET', () => {
        test('status:200, should return user object, given username', () => {
            return request(app).get('/api/users/butter_bridge').expect(200).then(({body:{user}})=>{
                expect(user.username).toBe('butter_bridge')
                expect(user.avatar_url).toBe('https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg')
                expect(user.name).toBe('jonny')
            })
        });
        test('status: 404, should return error message when given a non-existent username', () => {
            return request(app).get('/api/users/not-a-username').expect(404).then(({body:{msg}})=>{
                expect(msg).toBe('404: user does not exist');
            })
        });
    });
});

