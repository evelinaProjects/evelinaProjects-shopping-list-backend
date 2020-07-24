const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: {
        type: String
    }
});

module.exports = mongoose.model('Item', itemSchema);