require('dotenv').config();

const HttpError = require('./models/HttpError');

/* Init app */
const express = require('express');
const app = express();


/* Body Parser */
const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Orign, X-Requested-With, Content-Type, Accept, Authorozation');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
})

/* Routes handler */
const listsRoutes = require('./routes/lists');
app.use('/lists', listsRoutes);

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

/* const path = require('path');
app.use('/uploads/images/', express.static(path.join('uploads', 'images'))); */

/* Erorr handler */
app.use((req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    return next(new HttpError('Could not find this route', 404));
});


app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
        .json({ message: error.message || 'An unknown error occurred' });
});

/* handler connection to DB */
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, () => {
    try {
        app.listen(process.env.PORT || 3001 , () => {
            console.log(`App listening at port ${process.env.PORT}`);       
        });
    } catch (error) {
        console.log(error);

    }
}); 