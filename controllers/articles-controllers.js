const { selectArticleById, selectAllArticles } = require("../models/articles-models");

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    selectArticleById(article_id).then((article)=>{
        res.status(200).send({article});
    }).catch((error)=>{
        next(error);
    })
};

exports.getAllArticles = (req, res, next) => {
    selectAllArticles().then((articles)=>{
        res.status(200).send({articles});
    })
};