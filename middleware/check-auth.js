const HttpError = require('../models/HttpError');

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        if(req.method === 'OPTIONS'){
            return next();
        }
        const token = req.headers.authorozation.split(' ')[1];
        if (!token) {            
            throw new Error();
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = {userId: decodedToken.userId};
        next();
    } catch (error) {
        console.log(error);
        return next(new HttpError('Authorization', 403));
    }
};