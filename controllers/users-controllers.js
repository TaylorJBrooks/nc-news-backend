const { selectUsers } = require("../models/users-controllers")

exports.getAllUsers = (req, res, next) => {
    selectUsers().then((users)=>{
        res.status(200).send({users});
    })
}