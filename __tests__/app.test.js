const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));
afterAll(()=> db.end());

describe('unavailable path', () => {
    test('status 404: should return an error with msg, given a path that is not a valid endpoint', () => {
        return request(app).get('/not-a-path').expect(404).then(({body:{msg}})=>{
            expect(msg).toBe("path not found");
        })
    });
});

describe('/api/topics', () => {
    describe('GET', () => {
        test('status 200: should return an array of topic objects', () => {
            return request(app).get('/api/topics').expect(200).then(({body:{topics}})=>{
                expect(topics.length).toBe(3);
                topics.forEach((topic)=>{
                    expect(typeof topic.slug).toBe('string');
                    expect(typeof topic.description).toBe('string');
                })
            })
        });
    });
});