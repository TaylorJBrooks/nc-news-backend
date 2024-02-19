const db = require("../db/connection")

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then(({rows})=>{
        if(rows.length === 1){
            return rows[0];
        } else {
            return Promise.reject({status: 404, msg: "article does not exist"});
        }
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
    COUNT(comment_id) AS comment_count 
    FROM articles 
    JOIN comments 
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id 
    ORDER BY articles.created_at DESC`).then(({rows})=>{
        return rows.map((row)=>{
            row.comment_count = Number(row.comment_count);
            return row;
        })
    })
};