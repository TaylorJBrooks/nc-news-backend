const { selectAllTopics, selectTopicBySlug } = require("../models/topics-models");

exports.getTopics = (req, res, next) => {
    selectAllTopics().then((topics)=>{
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