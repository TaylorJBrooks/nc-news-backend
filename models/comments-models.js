const db = require("../db/connection")

exports.selectCommentsByArticleId = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [article_id]).then(({rows})=>{
        return rows;
    })
};

exports.insertComment = (body, author, article_id) => {
    const comment = [body, author, article_id];
    return db.query(`INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`, comment).then(({rows})=>{
        return rows[0];
    })
};

exports.deleteCommentFromDB = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({rowCount})=>{
        if(rowCount === 0){
            return Promise.reject({status: 404, msg: "404: comment does not exist"})
        }
        else return;
    })
}