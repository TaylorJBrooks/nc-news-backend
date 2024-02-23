const db = require("../db/connection");
const { getLimit } = require("./utils");

exports.selectCommentsByArticleId = (article_id, limit, page) => {
    const limitData = getLimit(limit, page)

    if(limitData === 'error'){
        return Promise.reject({ status: 400, msg: "400: bad request" });
    }

    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [article_id]).then(({rows})=>{
        if(limitData === 'no limit'){
            return rows;
        }
        const {numPerPage, offset} = limitData
        const start = offset;
        const end = offset + numPerPage;
        const comments = [...rows].slice(start, end);
        
        if (rows.length !== 0 && comments.length === 0) {
            return Promise.reject({ status: 404, msg: "404: no comments found" });
        }

        return comments;
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

exports.updateComment = (comment_id, inc_votes) => {
    return db.query(`
    UPDATE comments 
    SET votes = votes + $1 
    WHERE comment_id = $2 
    RETURNING *`, [inc_votes, comment_id]).then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status: 404, msg:"404: comment does not exist"})
        }
        return rows[0];
    })
}

exports.deleteCommentsByArticleId = (article_id) => {
    return db.query(`DELETE FROM comments WHERE article_id = $1`, [article_id])
}