const express = require('express');
const { getTopics } = require('./controllers/topics-controllers');
const { pathNotFound } = require('./error-handling');
const app = express();

app.get('/api/topics', getTopics);

app.all('/*', pathNotFound);

module.exports = app;