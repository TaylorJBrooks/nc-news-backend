const express = require('express');
const { getTopics } = require('./controllers/topics-controllers');
const { pathNotFound, customError, badRequest } = require('./controllers/errors-controllers');
const { getApi } = require('./controllers/api-controllers');
const { getArticleById, getAllArticles } = require('./controllers/articles-controllers');
const { getCommentsByArticleId } = require('./controllers/comments-controllers');
const app = express();

app.get('/api', getApi);

app.get('/api/topics', getTopics);
app.get('/api/articles', getAllArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.all('/*', pathNotFound);
app.use(customError);
app.use(badRequest);

app.use((error, req, res, next)=>{
    console.log(error);
    response.status(500).send({msg: "throwing error"})
})

module.exports = app;