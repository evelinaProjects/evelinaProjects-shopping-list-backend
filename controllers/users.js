const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const HttpError = require('../models/HttpError');
const User = require('../models/user');

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});



const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, 'email name image landmarks');
        res.json({ users });
    } catch (error) {
        return next(new HttpError('Fatching users faild, please try again later.', 500));
    }
}

const signup = async (req, res, next) => {
    const e = validationResult(req);
    if (e.errors.length > 0) {
        console.log(e);
        return next(new HttpError('Invalid inputs passed, Please cheack your data', 422));
    }

    const { name = '', email = '', password = '' } = req.body;
    let image = '';
    try {
        const hasMail = await User.findOne({ email })
        if (hasMail) {
            return next(new HttpError('Could not create user, email already exists.', 422));
        }
        if (req.body.image !== '') {
            const uploadResponse = await cloudinary.uploader.upload(req.body.image, { folder: 'uploads', width: 100, height: 100, gravity: "auto", crop: "fill" });
            image = uploadResponse.url;
        }
        const newUser = new User({
            name,
            image,
            email,
            password,
        });
        await newUser.save();

        res.status(201).json({
            user: {
                name: newUser.name,
                email: newUser.email,
                image: newUser.image
            }
        });
    } catch (error) {
        console.log(error);
        return next(new HttpError('Creating item failed, please try again', 500));
    }
};

const sigin = async (req, res, next) => {
    const e = validationResult(req);
    if (e.errors.length > 0) {
        console.log(e);
        return next(new HttpError('Invalid inputs passed, Please cheack your data', 422));
    }
    const { email, password } = req.body;

    try {
        const identifiedUser = await User.findOne({ email });
        if (!identifiedUser) {
            return next(new HttpError('invalid credentials, could not log you in.', 403));
        }
        const isValidPassword = identifiedUser.password === password ;
/*         const isValidPassword = await bcrypt.compare(password, identifiedUser.password);
 */        if (!isValidPassword) {
            return next(new HttpError('invalid credentials, could not log you in.', 403));
        }
/*         const token = jwt.sign(
            { userId: identifiedUser._id, email: identifiedUser.email },
            'secret',
            { expiresIn: '1h' }
        );
        res.json({ userId: identifiedUser._id, email: identifiedUser.email, token: token }); */
        res.json({user: { userId: identifiedUser._id, email: identifiedUser.email }}); 

    } catch (error) {
        return next(new HttpError('Logging in failed, please try again later.', 500));
    }
};

module.exports = {
    sigin,
    signup,
    getAllUsers,
}