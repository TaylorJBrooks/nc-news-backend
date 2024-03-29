const express = require('express');
const { pathNotFound, customError, badRequest, violatesForeignKeyConstraint, violatesNotNullConstraint } = require('./controllers/errors-controllers');
const apiRouter = require('./routes/api-router');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', pathNotFound);
app.use(customError);
app.use(badRequest);
app.use(violatesForeignKeyConstraint);
app.use(violatesNotNullConstraint);

app.use((error, req, res, next)=>{
    response.status(500).send({msg: "Internal Server Error"})
})

module.exports = app;