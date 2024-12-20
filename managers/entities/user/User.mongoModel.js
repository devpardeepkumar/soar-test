const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100,
    },
    role: {
        type: String,
        default:"staff",
        enum: ['admin', 'school-administrator', 'staff'], 
    },
    scopes:{
        type: Array,
        default:[]
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    title: {
        type: String,
        minlength: 3,
        maxlength: 300,
    },
    label: {
        type: String,
        minlength: 3,
        maxlength: 100,
    },
    shortDesc: {
        type: String,
        minlength: 3,
        maxlength: 300,
    },
    longDesc: {
        type: String,
        minlength: 3,
        maxlength: 2000,
    },
    url: {
        type: String,
        minlength: 9,
        maxlength: 300,
    },
    price: {
        type: Number,
    },
    avatar: {
        type: String,
        minlength: 8,
        maxlength: 100,
    },
    text: {
        type: String,
        minlength: 3,
        maxlength: 15,
    },
    longText: {
        type: String,
        minlength: 3,
        maxlength: 250,
    },
    paragraph: {
        type: String,
        minlength: 3,
        maxlength: 10000,
    },
    phone: {
        type: String,
        length: 13,
    },
    number: {
        type: Number,
        min: 1,
        max: 6,
    },
    arrayOfStrings: {
        type: [String],
        validate: {
            validator: function (array) {
                return array.every((str) => str.length >= 3 && str.length <= 100);
            },
            message: 'Each string in the array must be between 3 and 100 characters.',
        },
    },
  
});
const User = mongoose.model('users', userSchema);
module.exports = User;
