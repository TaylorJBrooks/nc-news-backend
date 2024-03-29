const { selectTopics, selectTopicBySlug, insertTopic } = require("../models/topics-models");

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics)=>{
        res.status(200).send({topics});
    })
};

exports.getTopicByName = (req, res, next) => {
    const {topic_name} = req.params;
    selectTopicBySlug(topic_name).then((topic)=>{
        res.status(200).send({topic})
    }).catch((error)=>{
        next(error);
    })
}

exports.postTopic = (req, res, next) => {
    const {slug, description} = req.body
    insertTopic(slug, description).then((topic)=>{
        res.status(201).send({topic})
    }).catch((err)=>{
        next(err);
    })
}