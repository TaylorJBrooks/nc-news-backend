const express = require('express');
const { getTopics, getTopicByName } = require('./controllers/topics-controllers');
const { pathNotFound, customError, badRequest, violatesForeignKeyConstraint, violatesNotNullConstraint } = require('./controllers/errors-controllers');
const { getApi } = require('./controllers/api-controllers');
const { getArticleById, getArticles, patchArticleById } = require('./controllers/articles-controllers');
const { getCommentsByArticleId, postComment, deleteComment } = require('./controllers/comments-controllers');
const { getAllUsers } = require('./controllers/users-controllers');
const app = express();

app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getTopics);
app.get('/api/topics/:topic_name', getTopicByName);

app.get('/api/articles', getArticles);

app.get('/api/users', getAllUsers);

app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticleById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postComment);

app.delete('/api/comments/:comment_id', deleteComment)

app.all('/*', pathNotFound);
app.use(customError);
app.use(badRequest);
app.use(violatesForeignKeyConstraint);
app.use(violatesNotNullConstraint);

app.use((error, req, res, next)=>{
    console.log(error);
    response.sendStatus(500).send({msg: "Internal Server Error"})
})

module.exports = app;