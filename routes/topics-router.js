const { getTopics, postTopic, getTopicByName } = require('../controllers/topics-controllers');

const topicsRouter = require('express').Router();

topicsRouter
    .route('/')
    .get(getTopics)
    .post(postTopic)

topicsRouter
    .route('/:topic_name')
    .get(getTopicByName)

module.exports = topicsRouter;