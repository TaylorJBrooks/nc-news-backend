const { getApi } = require('../controllers/api-controllers');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');

const apiRouter = require('express').Router();

apiRouter
    .route('/')
    .get(getApi)

apiRouter.use('/topics', topicsRouter)

apiRouter.use('/users', usersRouter)

apiRouter.use('/articles', articlesRouter)

apiRouter.use('/comments', commentsRouter)

module.exports = apiRouter;