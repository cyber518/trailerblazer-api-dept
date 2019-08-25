//Modelu dependencies
const express = require('express');
const bodyParser = require('body-parser');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');

//Set dotenv path
dotEnv.config({
    path: './.env'
});

//Connect to mongoose
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log('Connected to MongoDB Cloud Database');
});

//Define route paths
var searchRouter = require('./routes/search');
var authRRouter = require('./routes/auth');

var app = express();

//Body Parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Assign routes to paths
app.use('/search', searchRouter);
app.use('/user', authRRouter);

//Handle errors
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500 );
    res.json({
        error: {
            message: error.message
        }
    })
});

require('./production/prod')(app);

//Run server
app.listen(process.env.PORT, () => console.log('App is running from port '+ process.env.PORT));

module.exports = app;
