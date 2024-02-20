const express = require('express');
const { getTopics } = require('./controllers/topics-controllers');
const { pathNotFound, customError, badRequest } = require('./error-handling');
const { getApi } = require('./controllers/api-controllers');
const { getArticleById, getAllArticles } = require('./controllers/articles-controllers');
const { getCommentsByArticleId, postComment } = require('./controllers/comments-controllers');
const app = express();

app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getTopics);
app.get('/api/articles', getAllArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postComment);

app.all('/*', pathNotFound);
app.use(customError);
app.use(badRequest);

app.use((error, req, res, next)=>{
    console.log(error);
    response.status(500).send({msg: "Internal server error!"})
})

module.exports = app;