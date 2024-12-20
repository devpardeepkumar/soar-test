const mongoose = require('mongoose');
const SchoolSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        address: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        shortDesc: {
            type: String,
        },
        longDesc: {
            type: String,
        },
        website: {
            type: String,
            match: /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w\.-]*)*\/?$/,
        },
        phone: {
            type: String,
            match: /^\+?[1-9]\d{1,14}$/,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            default: null
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            default: null
        },
    },
    { timestamps: true }
);
const Schools = mongoose.model('schools', SchoolSchema);
module.exports = Schools;
