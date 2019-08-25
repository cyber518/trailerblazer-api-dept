//Define dependencies
const mongoose = require('mongoose');

//Definde User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 127
    },
    email: {
        type: String,
        required: true,
        max: 127,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 8
    },
     date: {
         type: Date,
         default: Date.now
     }
});

module.exports = mongoose.model('User', userSchema);