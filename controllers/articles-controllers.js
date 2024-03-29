const { selectArticleById, selectArticles, updateArticleById, insertArticle, deleteArticleFromDB } = require("../models/articles-models");
const { deleteCommentsByArticleId } = require("../models/comments-models");
const { selectTopicBySlug } = require("../models/topics-models");

exports.getArticles = (req, res, next) => {
    const { topic, sort_by, order, limit, p} = req.query;
    const promises = [selectArticles(topic, sort_by, order, limit, p)]

    if(topic){
        promises.push(selectTopicBySlug(topic))
    }

    Promise.all(promises).then((promisesResults)=>{
        const articles = promisesResults[0];
        res.status(200).send(articles);
    }).catch((error)=>{
        next(error);
    })
};

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    selectArticleById(article_id).then((article)=>{
        res.status(200).send({article});
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

exports.postArticle = (req, res, next) => {
    const newArticle = req.body
    insertArticle(newArticle).then((insertedArticle)=>{
        const {article_id} = insertedArticle;
        return selectArticleById(article_id)
    }).then((article)=>{
        res.status(201).send({article})
    }).catch((err)=>{
        next(err)
    })
}

exports.deleteArticleById = (req, res, next) => {
    const {article_id} = req.params
    const promises = [deleteCommentsByArticleId(article_id), deleteArticleFromDB(article_id)]

    Promise.all(promises).then(()=>{
        res.sendStatus(204)
    }).catch((err)=>{
        next(err);
    })
}