const express = require('express');
const router = express.Router()

const { check } = require('express-validator');

const {
    getAllitems,
    AddNewItem,
    deleteItemById
} = require('../controllers/items')

router.get('/', getAllitems);

router.post('/', [check('title').not().isEmpty()], AddNewItem)

router.delete('/:_id', deleteItemById)
module.exports = router;