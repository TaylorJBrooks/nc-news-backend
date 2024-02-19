exports.pathNotFound = (req, res, next) => {
    res.status(404).send({msg: "path not found"});
};

exports.customError = (err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg});
    }
    else next(err);
};

exports.badRequest = (err, req, res, next) => {
    if(err.code === '22P02'){
        res.status(400).send({msg: 'bad request'});
    }
    else next(err);
}