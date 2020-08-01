const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const HttpError = require('../models/HttpError');
const Item  = require('../models/item');

const getAllitems = async (req, res, next) => {
    const { limit, page } = req.query;

    const skip = (page - 1) * limit;

    try {
        let items;
        if(limit && page){
            items = await Item.find({}).skip(skip).limit(parseInt(limit));
        } else {
            items = await Item.find({});
        }
        res.json({items});
    } catch (error) {
        console.log(error);
        return next(new HttpError('Something went werong, could not find an items', 500));
    }
};

const AddNewItem = async (req, res, next) => {
    const e = validationResult(req);
    if (e.errors.length > 0) {
        console.log(e);

        return next(new HttpError('Invalid inputs passed, Please cheack your data', 422));
    }

    const {title} = req.body;
    const newItem = new Item({
        title
    });
    try {
        await newItem.save();
        res.status(201).json({newItem});
    } catch (error) {
        console.log(error);
        return next(new HttpError('Creating item failed, please try again', 500));
    }
};

const deleteItemById = async (req, res, next) => {
    const itemId = req.params.id;
    try {
        const item = await Item.findById(itemId);
        if(!item){
            return next(new HttpError('Could not find item for this id.', 404));
        }
        await item.remove();
        res.status(200).json({item});
    } catch (error) {
        console.log(error);
        return next(new HttpError('Something went wrong, could not delete this item', 500));
    }
};

module.exports = {
    getAllitems,
    AddNewItem,
    deleteItemById
}