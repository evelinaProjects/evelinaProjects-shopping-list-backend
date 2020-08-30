const express = require('express');
const router = express.Router()

const { check } = require('express-validator');

const {
    getUserLists,
    createNewList,
    updateListById,
    deleteListById
} = require('../controllers/lists');

const checkAuth = require('../middleware/check-auth');
router.use(checkAuth);

router.get('/', getUserLists);

router.post('/', createNewList);

router.patch('/', [
    check('_id').not().isEmpty(),
  ], updateListById);

router.delete('/:lid', deleteListById);



module.exports = router;