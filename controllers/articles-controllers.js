const { selectArticleById, selectArticles, updateArticleById } = require("../models/articles-models");
const { selectTopicBySlug } = require("../models/topics-models");

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    selectArticleById(article_id).then((article)=>{
        res.status(200).send({article});
    }).catch((error)=>{
        next(error);
    })
};

exports.getArticles = (req, res, next) => {
    const { topic } = req.query;
    const promises = [selectArticles(topic)]

    if(topic){
        promises.push(selectTopicBySlug(topic))
    }

    Promise.all(promises).then((promisesResults)=>{
        const articles = promisesResults[0];
        res.status(200).send({articles});
    }).catch((error)=>{
        next(error);
    })
};

exports.patchArticleById = (req, res, next) => {
    const {article_id} = req.params;
    const {inc_votes} = req.body;

    updateArticleById(article_id, inc_votes).then((article)=>{
        res.status(200).send({article});
    }).catch((error)=>{
        next(error);
    })
};