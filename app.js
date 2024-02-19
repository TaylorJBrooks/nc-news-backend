const express = require('express');
const { getTopics } = require('./controllers/topics-controllers');
const { pathNotFound } = require('./error-handling');
const { getApi } = require('./controllers/api-controllers');
const app = express();

app.get('/api', getApi);
app.get('/api/topics', getTopics);

app.all('/*', pathNotFound);

module.exports = app;