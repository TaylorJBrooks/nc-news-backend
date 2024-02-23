const db = require("../db/connection")

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`).then(({rows})=>{
        return rows;
    })
};

exports.selectTopicBySlug = (slug) => {
    return db.query(`SELECT * FROM topics WHERE slug = $1`, [slug]).then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "404: topic does not exist"})
        }
        return rows[0];
    })
}

exports.insertTopic = (slug, description) => {
    if(!description){
        return Promise.reject({status: 422, msg: '422: required data missing'})
    }
    return db.query(`INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`, [slug, description]).then(({rows})=>{
        return rows[0];
    })
}