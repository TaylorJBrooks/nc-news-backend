const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  const queryString = `
    SELECT articles.*, 
    COUNT(comment_id) ::INT AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1 
    GROUP BY articles.article_id`;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "404: article does not exist",
      });
    }
    return rows[0];
  });
};

//     const validSortBy = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url', 'comment_count'];
//     const validOrder = ['asc', 'desc'];

//     if(!validSortBy.includes(sort_by) || !validOrder.includes(order)){
//         return Promise.reject({status: 400, msg: '400: bad request'})
//     }

//   let queryString = `SELECT
//     articles.author,
//     title,
//     articles.article_id,
//     topic,
//     articles.created_at,
//     articles.votes,
//     article_img_url,
//     COUNT(comment_id) ::INT AS comment_count
//     FROM articles
//     LEFT JOIN comments ON articles.article_id = comments.article_id `;

//   const queries = [];

//   if (topic) {
//     queries.push(topic);
//     queryString += ` WHERE topic = $${queries.length}`;
//   }

//   queryString += ` GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order}`

//   let limitedQueryString = queryString

//   const limits = []

//   let numPerPage;

//   if(limit === ''){
//     numPerPage = 10;
//     limitedQueryString += ` LIMIT 10`
//   } else if (limit) {
//     numPerPage = limit;
//     limits.push(limit)
//     limitedQueryString += ` LIMIT $${limits.length}`
//   }

//   if(page>1){
//     const offset = numPerPage*(page-1)
//     limits.push(offset);
//     limitedQueryString += ` OFFSET $${limits.length}`
//   }

//   const promises = [db.query(queryString, queries), db.query(limitedQueryString, limits)]

//   return Promise.all(promises).then((promisesResults) => {
//     const articles = promisesResults[1].rows
//     const unLimitedArticles = promisesResults[0].rows
//     return {articles, total_count: unLimitedArticles.length}
//   });
// };

exports.selectArticles = (
  topic,
  sort_by = "created_at",
  order = "desc",
  limit,
  page
) => {
  const validSortBy = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const validOrder = ["asc", "desc"];

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "400: bad request" });
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
    queries.push(topic);
    queryString += ` WHERE topic = $${queries.length}`;
  }

  queryString += ` GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order}`;

  let numPerPage = 0;

  if (limit === "") {
    numPerPage += 10;
  } else if (limit >= 0) {
    numPerPage += limit * 1;
  } else if (limit) {
    return Promise.reject({ status: 400, msg: "400: bad request" });
  }

  let offset = 0;

  if (page > 1) {
    offset += numPerPage * (page - 1);
  } else if (page === 1) {
    offset += 0;
  } else if (page) {
    return Promise.reject({ status: 400, msg: "400: bad request" });
  }

  return db.query(queryString, queries).then(({ rows }) => {
    if (limit === "" || limit) {
      const start = offset;
      const end = offset + numPerPage;
      const total_count = rows.length;
      const articles = [...rows].slice(start, end);

      if (total_count !== 0 && articles.length === 0) {
        return Promise.reject({ status: 404, msg: "404: no articles found" });
      }
      
      return { articles, total_count };
    } else {
      return { articles: rows, total_count: rows.length };
    }
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

exports.insertArticle = (newArticle) => {
  const { title, topic, author, body, article_img_url } = newArticle;
  const queries = [title, topic, author, body];
  let queryString = `INSERT INTO articles `;

  if (article_img_url) {
    queryString += `(title, topic, author, body, article_img_url)
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`;
    queries.push(article_img_url);
  } else {
    queryString += `(title, topic, author, body)
        VALUES ($1, $2, $3, $4) 
        RETURNING *`;
  }

  return db.query(queryString, queries).then(({ rows }) => {
    return rows[0];
  });
};

exports.deleteArticleFromDB = (article_id) => {
  return db
    .query(`DELETE FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "404: article does not exist",
        });
      } else return;
    });
};
