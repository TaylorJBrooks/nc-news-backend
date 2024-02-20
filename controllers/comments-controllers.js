const { selectCommentsByArticleId, insertComment } = require("../models/comments-models");

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    selectCommentsByArticleId(article_id).then((comments)=>{
        res.status(200).send({comments});
    }).catch((error)=>{
        next(error);
    })
};

exports.postComment = (req, res, next) => {
    const  {body, username} = req.body;
    const {article_id} = req.params;
    insertComment(body, username, article_id).then((comment)=>{
        res.status(201).send({comment})
    })
};