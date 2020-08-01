const express = require('express');
const router = express.Router()

const { check } = require('express-validator');

const {
    sigin,
    signup,
    getAllUsers,
} = require('../controllers/users')

router.get('/', getAllUsers);


router.post('/signup',
    [check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').not().isEmpty()], 
    signup);

router.post('/signin',
    [check('email').normalizeEmail().isEmail(),
    check('password').not().isEmpty()], 
    sigin);




module.exports = router;