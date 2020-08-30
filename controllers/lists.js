const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const HttpError = require('../models/HttpError');
const List  = require('../models/list');
const User  = require('../models/user');

const getUserLists = async (req, res, next) => {

    const uid  = req.userData.userId
    const title  = req.query.title;

    try {
        const user = await User.findById(uid).populate('lists'); 
        let lists
        if(title) {
            lists = user.lists.filter(list => list.title.startsWith(title)); 
        } else lists = user.lists
        res.json({lists});
    } catch (error) {
        console.log(error);
        return next(new HttpError('Something went werong, could not find an items', 500));
    }
};


const createNewList = async (req, res, next) => {
    const uid  = req.userData.userId;

    let { title } = req.body;

    let user;
    let newList;
    try {
        user = await User.findById(uid);
        if (!user) {
            return next(new HttpError('Could not find user for provided id', 404));
        }

        newList = new List({
            title,
            user,
            items: []
        });

        await newList.save();
    } catch (error) {
        console.log(error);
        return next(new HttpError('Creating list failed, please try again', 500));
    }

    try {
        user.lists.push(newList);
        await user.save();
        res.status(201).json({list: {_id: newList._id, title: newList.title, items: newList.items}});
    } catch (error) {
        return next(new HttpError('Creating list failed, please try again', 500));
    }
};

const updateListById = async (req, res, next) => {
    const e = validationResult(req);
    if (e.errors.length > 0) {
        console.log(e);
        return next(new HttpError('Invalid inputs passed, Please cheack your data', 422));
    };

    const uid = req.userData.userId;
    const { _id, title, items } = req.body;

    try {
        const listToUpdate = await List.findById(_id);
        if (!listToUpdate) {
            return next(new HttpError('Could not find a landmark for the provided id.', 404));
        }
        if (listToUpdate.user.toString() !== uid) {
            return next(new HttpError('You are not allowed to edit this landmark.', 401));
        }
        listToUpdate.title = title;
        listToUpdate.items = items;
        await listToUpdate.save();
        

        res.status(201).json({list: listToUpdate});
    } catch (error) {
        return next(new HttpError('Something went wrong, could not update landmark.', 500));
    }
};

const deleteListById = async (req, res, next) => {

    const uid = req.userData.userId;
    const lid  = req.params.lid;

    try {
        const list = await List.findByIdAndRemove(lid).populate('user');
        if (!list) {
            return next(new HttpError('Could not find list for this id.', 404));
        }
        if (list.user.id !== uid) {
            return next(new HttpError('You are not allowed to delete this landmark.', 401));
        }

        list.user.lists.pull(list);
        try {
            await list.user.save();
        } catch (error) {
            return next(new HttpError('Something went wrong, could not delete list 1', 500));
        }
        res.status(200).json({ message: 'Deleted list.' });
    } catch (error) {
        console.log(error);
        return next(new HttpError('Something went wrong, could not delete palce 2', 500));
    }
};

module.exports = {
    getUserLists,
    createNewList,
    updateListById,
    deleteListById
}