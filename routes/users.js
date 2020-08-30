const express = require('express');
const router = express.Router()

const { check } = require('express-validator');

const {
    signin,
    signup,
    getAllUsers,
} = require('../controllers/users')

router.get('/', getAllUsers);

router.post('/signup',
    [check('username').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').not().isEmpty()], 
    signup);

router.post('/signin',
    [check('email').normalizeEmail().isEmail(),
    check('password').not().isEmpty()], 
    signin);






module.exports = router;