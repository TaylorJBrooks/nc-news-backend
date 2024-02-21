const { selectArticleById } = require("../models/articles-models");
const { selectCommentsByArticleId, insertComment, deleteCommentFromDB, updateComment } = require("../models/comments-models");

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const promises = [selectCommentsByArticleId(article_id), selectArticleById(article_id)];

    Promise.all(promises).then((promisesReturned)=>{
        const comments = promisesReturned[0];
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
    }).catch((error)=>{
        next(error);
    })
};

exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params;
    deleteCommentFromDB(comment_id).then(()=>{
        res.sendStatus(204);
    }).catch((error)=>{
        next(error);
    })
};

exports.patchComment = (req, res, next) => {
    const {comment_id}=req.params
    const {inc_votes}= req.body
    updateComment(comment_id, inc_votes).then((comment)=>{
        res.status(200).send({comment});
    }).catch((err)=>{
        next(err)
    })
}