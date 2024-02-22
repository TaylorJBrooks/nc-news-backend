const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
    const queryString = `
    SELECT articles.*, 
    COUNT(comment_id) ::INT AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1 
    GROUP BY articles.article_id`;
    
  return db
    .query(queryString, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "404: article does not exist",
        });
      }
      return rows[0];
    });
};

exports.selectArticles = (topic, sort_by='created_at', order='desc') => {
    const validSortBy = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url', 'comment_count'];
    const validOrder = ['asc', 'desc'];

    if(!validSortBy.includes(sort_by) || !validOrder.includes(order)){
        return Promise.reject({status: 400, msg: '400: bad request'})
    }

  let queryString = `SELECT 
    articles.author, 
    title, 
    articles.article_id, 
    topic, 
    articles.created_at, 
    articles.votes, 
    article_img_url,
    COUNT(comment_id) ::INT AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id `;

  const queries = [];

  if (topic) {
    queryString += ` WHERE topic = $1`;
    queries.push(topic);
  }

  queryString += ` GROUP BY articles.article_id`
  
  queryString += ` ORDER BY articles.${sort_by} ${order}`

  return db.query(queryString, queries).then(({ rows }) => {
    return rows
  });
};

exports.updateArticleById = (article_id, inc_votes) => {
  return db
    .query( `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "404: article does not exist",
        });
      }
      return rows[0];
    });
};

exports.insertArticle = (newArticle) => {
    const {title, topic, author, body, article_img_url} = newArticle;
    const queries = [title, topic, author, body];
    let queryString = `INSERT INTO articles `

    if(article_img_url){
        queryString += `(title, topic, author, body, article_img_url)
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`
        queries.push(article_img_url);
    } else {
        queryString += `(title, topic, author, body)
        VALUES ($1, $2, $3, $4) 
        RETURNING *`
    }

    return db.query(queryString, queries).then(({rows})=>{
        return rows[0];
    })
}