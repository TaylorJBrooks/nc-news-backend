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

exports.selectArticles = (topic) => {
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

  queryString += ` GROUP BY articles.article_id ORDER BY articles.created_at DESC`

  return db.query(queryString, queries).then(({ rows }) => {
    return rows
  });
};

exports.updateArticleById = (article_id, inc_votes) => {
  return db
    .query(
      `
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
