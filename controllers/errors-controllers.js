exports.pathNotFound = (req, res, next) => {
    res.status(404).send({msg: "404: path not found, visit the /api endpoint for all available endpoints"});
};

exports.customError = (err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg});
    }
    else next(err);
};

exports.badRequest = (err, req, res, next) => {
    const errCodes = ['22P02']
    if(errCodes.includes(err.code)){
        res.status(400).send({msg: '400: bad request'});
    }
    else next(err);
}

exports.violatesForeignKeyConstraint = (err, req, res, next) => {
    if(err.code === '23503' && err.constraint === 'comments_article_id_fkey') {
        res.status(404).send({msg: "404: article does not exist"})
    } else if(err.code === '23503' && err.constraint === 'articles_topic_fkey'){
        res.status(404).send({msg: '404: topic does not exist'})
    }
    else if(err.code === '23503' && err.constraint === 'comments_author_fkey'){
        res.status(422).send({msg: '422: username does not belong to a registered user'})
    }
    else if(err.code === '23503' && err.constraint === 'articles_author_fkey'){
        res.status(422).send({msg: '422: author is not a registered user'})
    }
    else next(err);
};

exports.violatesNotNullConstraint = (err, req, res, next) => {
    if(err.code === '23502'){
        res.status(422).send({msg: '422: required data missing'})
    }
    else next(err);
};