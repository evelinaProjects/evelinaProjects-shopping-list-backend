const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    image: {
        type: String,
    },
    lists: [{ 
        type: mongoose.Types.ObjectId, 
        ref: 'List' 
    }]
});

module.exports = mongoose.model('User', userSchema);