const express = require('express');
const { getTopics, getTopicByName, postTopic } = require('./controllers/topics-controllers');
const { pathNotFound, customError, badRequest, violatesForeignKeyConstraint, violatesNotNullConstraint } = require('./controllers/errors-controllers');
const { getApi } = require('./controllers/api-controllers');
const { getArticleById, getArticles, patchArticleById, postArticle } = require('./controllers/articles-controllers');
const { getCommentsByArticleId, postComment, deleteComment, patchComment } = require('./controllers/comments-controllers');
const { getAllUsers, getUserByUsername } = require('./controllers/users-controllers');
const app = express();

app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getTopics);
app.post('/api/topics', postTopic);

app.get('/api/topics/:topic_name', getTopicByName);

app.get('/api/users', getAllUsers);
app.get('/api/users/:username', getUserByUsername)

app.get('/api/articles', getArticles);
app.post('/api/articles', postArticle);

app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticleById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postComment);

app.delete('/api/comments/:comment_id', deleteComment)
app.patch('/api/comments/:comment_id', patchComment)

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