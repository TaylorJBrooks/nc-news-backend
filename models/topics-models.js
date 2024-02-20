const db = require("../db/connection")

exports.selectAllTopics = () => {
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