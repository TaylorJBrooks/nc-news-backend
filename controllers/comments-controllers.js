const { selectArticleById } = require("../models/articles-models");
const { selectCommentsByArticleId, insertComment } = require("../models/comments-models");

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const promises = [selectCommentsByArticleId(article_id), selectArticleById(article_id)];

    Promise.all(promises).then((promisesReturned)=>{
        const comments = promisesReturned[0];
        if(comments.length === 0){
            res.sendStatus(204);    
        }
        else res.status(200).send({comments});
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