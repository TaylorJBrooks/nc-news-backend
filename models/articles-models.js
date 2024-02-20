const db = require("../db/connection")

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "404: article does not exist"});
        }
        return rows[0];
    })
};

exports.selectAllArticles = () => {
    return db.query(`SELECT 
    articles.author, 
    title, 
    articles.article_id, 
    topic, 
    articles.created_at, 
    articles.votes, 
    article_img_url,
    COUNT(comment_id) ::INT AS comment_count 
    FROM articles 
    JOIN comments 
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id 
    ORDER BY articles.created_at DESC`).then(({rows})=>{
        return rows.map((row)=>{
            return row;
        })
    })
};

exports.updateArticleById = (article_id, inc_votes) => {
    return db.query(`
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `, [inc_votes, article_id]).then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "404: article does not exist"})
        }
        return rows[0];
    })
};